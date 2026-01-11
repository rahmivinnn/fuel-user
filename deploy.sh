#!/bin/bash

# FuelFriendly Auto Deploy Script
set -e

PROJECT_DIR="/var/www/fuel-user"
BACKUP_DIR="/var/backups/fuel-user"
LOG_FILE="/var/log/fuel-deploy.log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a $LOG_FILE
}

error() {
    echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1" | tee -a $LOG_FILE
}

warn() {
    echo -e "${YELLOW}[$(date '+%Y-%m-%d %H:%M:%S')] WARNING:${NC} $1" | tee -a $LOG_FILE
}

# Create backup
create_backup() {
    log "Creating backup..."
    mkdir -p $BACKUP_DIR
    if [ -d "$PROJECT_DIR" ]; then
        tar -czf "$BACKUP_DIR/backup-$(date +%Y%m%d-%H%M%S).tar.gz" -C "$PROJECT_DIR" . 2>/dev/null || warn "Backup creation failed"
    fi
}

# Git pull and update
update_code() {
    log "Updating code from Git..."
    cd $PROJECT_DIR
    
    # Stash any local changes
    git stash push -m "Auto-stash before deploy $(date)" 2>/dev/null || true
    
    # Pull latest changes
    git pull origin main || {
        error "Git pull failed"
        exit 1
    }
    
    log "Code updated successfully"
}

# Build frontend
build_frontend() {
    log "Building frontend..."
    cd $PROJECT_DIR/frontend
    
    # Install dependencies if package.json changed
    if [ package.json -nt node_modules/.package-lock.json ] 2>/dev/null; then
        log "Installing frontend dependencies..."
        npm ci --production=false
    fi
    
    # Build for production
    npm run build || {
        error "Frontend build failed"
        exit 1
    }
    
    log "Frontend built successfully"
}

# Install backend dependencies
install_backend_deps() {
    log "Installing backend dependencies..."
    cd $PROJECT_DIR/backend
    
    if [ package.json -nt node_modules/.package-lock.json ] 2>/dev/null; then
        npm ci --production
    fi
}

# Deploy with Docker Compose
deploy_services() {
    log "Deploying services with Docker Compose..."
    cd $PROJECT_DIR
    
    # Pull latest images
    docker-compose pull 2>/dev/null || true
    
    # Build and start services
    docker-compose up -d --build || {
        error "Docker deployment failed"
        exit 1
    }
    
    log "Services deployed successfully"
}

# Health check
health_check() {
    log "Performing health check..."
    
    # Wait for services to start
    sleep 10
    
    # Check backend
    if curl -f -s http://localhost:4000/api/health > /dev/null; then
        log "✅ Backend is healthy"
    else
        error "❌ Backend health check failed"
        return 1
    fi
    
    # Check frontend
    if curl -f -s http://localhost/health > /dev/null; then
        log "✅ Frontend is healthy"
    else
        error "❌ Frontend health check failed"
        return 1
    fi
    
    log "🎉 Deployment completed successfully!"
}

# Cleanup old backups (keep last 5)
cleanup_backups() {
    log "Cleaning up old backups..."
    find $BACKUP_DIR -name "backup-*.tar.gz" -type f -mtime +7 -delete 2>/dev/null || true
}

# Main deployment process
main() {
    log "🚀 Starting FuelFriendly deployment..."
    
    create_backup
    update_code
    build_frontend
    install_backend_deps
    deploy_services
    
    if health_check; then
        cleanup_backups
        log "✅ Deployment completed successfully!"
        
        # Send notification (optional)
        curl -X POST "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/sendMessage" \
             -d "chat_id=$TELEGRAM_CHAT_ID" \
             -d "text=🚀 FuelFriendly deployed successfully at $(date)" 2>/dev/null || true
    else
        error "❌ Deployment failed health check"
        exit 1
    fi
}

# Run main function
main "$@"