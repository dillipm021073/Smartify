# PowerShell script to set up port forwarding from Windows to WSL2
# Run this in Windows PowerShell AS ADMINISTRATOR

Write-Host "`n=== WSL2 Port Forwarding Setup ===" -ForegroundColor Cyan
Write-Host ""

# Get WSL2 IP address
$wslIP = wsl hostname -I | ForEach-Object { $_.Trim().Split(' ')[0] }
Write-Host "WSL2 IP detected: $wslIP" -ForegroundColor Yellow

# Get Windows WiFi IP
$windowsIP = Get-NetIPAddress -AddressFamily IPv4 |
    Where-Object {
        ($_.InterfaceAlias -like "*Wi-Fi*" -or $_.InterfaceAlias -like "*Wireless*" -or $_.InterfaceAlias -like "*Ethernet*") -and
        $_.IPAddress -notlike "169.254.*" -and
        $_.IPAddress -notlike "127.*" -and
        $_.IPAddress -notlike "172.1*"
    } |
    Select-Object -First 1

if ($windowsIP) {
    Write-Host "Windows Network IP: $($windowsIP.IPAddress)" -ForegroundColor Green
    Write-Host "Adapter: $($windowsIP.InterfaceAlias)" -ForegroundColor Gray
} else {
    Write-Host "Warning: No network IP detected" -ForegroundColor Red
}

Write-Host ""
Write-Host "Setting up port forwarding..." -ForegroundColor Yellow

# Ports to forward
$ports = @(5173, 5001, 5000)

foreach ($port in $ports) {
    Write-Host "Forwarding port $port..." -NoNewline

    # Remove existing rule if it exists
    $existingRule = netsh interface portproxy show v4tov4 | Select-String -Pattern "0.0.0.0\s+$port"
    if ($existingRule) {
        netsh interface portproxy delete v4tov4 listenport=$port listenaddress=0.0.0.0 | Out-Null
    }

    # Add new port forwarding rule
    netsh interface portproxy add v4tov4 listenport=$port listenaddress=0.0.0.0 connectport=$port connectaddress=$wslIP | Out-Null

    Write-Host " Done" -ForegroundColor Green
}

Write-Host ""
Write-Host "Setting up Windows Firewall rules..." -ForegroundColor Yellow

foreach ($port in $ports) {
    Write-Host "Creating firewall rule for port $port..." -NoNewline

    # Create comprehensive firewall rule name
    $firewallRuleName = "Smartify - Port $port"

    # Remove old WSL2 rule if exists
    $oldRule = Get-NetFirewallRule -DisplayName "WSL2 Port $port" -ErrorAction SilentlyContinue
    if ($oldRule) {
        Remove-NetFirewallRule -DisplayName "WSL2 Port $port" | Out-Null
    }

    # Check if Smartify rule exists
    $existingFirewallRule = Get-NetFirewallRule -DisplayName $firewallRuleName -ErrorAction SilentlyContinue
    if ($existingFirewallRule) {
        # Enable if disabled
        if (-not $existingFirewallRule.Enabled) {
            Enable-NetFirewallRule -DisplayName $firewallRuleName | Out-Null
            Write-Host " Enabled" -ForegroundColor Green
        } else {
            Write-Host " Already exists" -ForegroundColor Gray
        }
    } else {
        # Create new rule for all profiles (Domain, Private, Public)
        New-NetFirewallRule `
            -DisplayName $firewallRuleName `
            -Direction Inbound `
            -Protocol TCP `
            -LocalPort $port `
            -Action Allow `
            -Profile Domain,Private,Public `
            -Enabled True `
            | Out-Null
        Write-Host " Created" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "=== Port Forwarding Active ===" -ForegroundColor Cyan
netsh interface portproxy show v4tov4

Write-Host ""
Write-Host "=== Mobile Access URLs ===" -ForegroundColor Cyan
if ($windowsIP) {
    Write-Host "Customer Portal (Vite): http://$($windowsIP.IPAddress):5173/apply" -ForegroundColor White
    Write-Host "Agent Portal (Vite):    http://$($windowsIP.IPAddress):5173/agent" -ForegroundColor White
    Write-Host "Backend API:            http://$($windowsIP.IPAddress):5001/api" -ForegroundColor White
}

Write-Host ""
Write-Host "Note: To remove port forwarding later, run:" -ForegroundColor Yellow
Write-Host "netsh interface portproxy reset" -ForegroundColor Gray
