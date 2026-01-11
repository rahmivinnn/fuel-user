#!/bin/bash

# Simple webhook server for auto-deployment
# Usage: ./webhook-server.sh [port]

PORT=${1:-9000}
PROJECT_DIR="/var/www/fuel-user"
LOG_FILE="/var/log/fuel-deploy.log"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a $LOG_FILE
}

# Create simple HTTP server
create_webhook() {
    cat > /tmp/webhook.py << EOF
#!/usr/bin/env python3
import http.server
import socketserver
import subprocess
import json
from urllib.parse import urlparse, parse_qs

class WebhookHandler(http.server.BaseHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/deploy':
            try:
                # Run deployment script
                result = subprocess.run(['$PROJECT_DIR/deploy.sh'], 
                                      capture_output=True, text=True, timeout=300)
                
                if result.returncode == 0:
                    self.send_response(200)
                    self.send_header('Content-type', 'application/json')
                    self.end_headers()
                    response = {'status': 'success', 'message': 'Deployment completed'}
                    self.wfile.write(json.dumps(response).encode())
                else:
                    self.send_response(500)
                    self.send_header('Content-type', 'application/json')
                    self.end_headers()
                    response = {'status': 'error', 'message': result.stderr}
                    self.wfile.write(json.dumps(response).encode())
                    
            except subprocess.TimeoutExpired:
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                response = {'status': 'error', 'message': 'Deployment timeout'}
                self.wfile.write(json.dumps(response).encode())
                
        else:
            self.send_response(404)
            self.end_headers()
    
    def do_GET(self):
        if self.path == '/health':
            self.send_response(200)
            self.send_header('Content-type', 'text/plain')
            self.end_headers()
            self.wfile.write(b'OK')
        else:
            self.send_response(404)
            self.end_headers()

if __name__ == "__main__":
    PORT = $PORT
    with socketserver.TCPServer(("", PORT), WebhookHandler) as httpd:
        print(f"Webhook server running on port {PORT}")
        print(f"Deploy endpoint: http://localhost:{PORT}/deploy")
        httpd.serve_forever()
EOF

    chmod +x /tmp/webhook.py
}

# Create systemd service
create_service() {
    cat > /etc/systemd/system/fuel-webhook.service << EOF
[Unit]
Description=FuelFriendly Webhook Server
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=$PROJECT_DIR
ExecStart=/usr/bin/python3 /tmp/webhook.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

    systemctl daemon-reload
    systemctl enable fuel-webhook
    systemctl start fuel-webhook
}

main() {
    log "Setting up webhook server on port $PORT..."
    
    create_webhook
    create_service
    
    log "✅ Webhook server started!"
    log "Deploy URL: http://your-server:$PORT/deploy"
    log "Health check: http://your-server:$PORT/health"
    log ""
    log "Usage:"
    log "curl -X POST http://your-server:$PORT/deploy"
}

main "$@"