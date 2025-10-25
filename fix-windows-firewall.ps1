# Windows Firewall Fix for Mobile Access
# Run this in Windows PowerShell AS ADMINISTRATOR

Write-Host "`n=== Windows Firewall Configuration for Mobile Access ===" -ForegroundColor Cyan
Write-Host ""

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "ERROR: This script must be run as Administrator!" -ForegroundColor Red
    Write-Host "Right-click PowerShell and select 'Run as Administrator'" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "✓ Running as Administrator" -ForegroundColor Green
Write-Host ""

# Ports to open
$ports = @(
    @{Port=5173; Name="Vite Dev Server (Frontend)"; Protocol="TCP"},
    @{Port=5001; Name="Backend API Server"; Protocol="TCP"},
    @{Port=5000; Name="Backend API (Alternative)"; Protocol="TCP"}
)

Write-Host "=== Checking Existing Firewall Rules ===" -ForegroundColor Yellow
Write-Host ""

foreach ($portInfo in $ports) {
    $port = $portInfo.Port
    $name = "Smartify - Port $port"

    # Check if rule already exists
    $existingRule = Get-NetFirewallRule -DisplayName $name -ErrorAction SilentlyContinue

    if ($existingRule) {
        Write-Host "Rule '$name' already exists" -ForegroundColor Gray

        # Check if enabled
        if ($existingRule.Enabled -eq $true) {
            Write-Host "  Status: Enabled ✓" -ForegroundColor Green
        } else {
            Write-Host "  Status: Disabled - Enabling..." -NoNewline
            Enable-NetFirewallRule -DisplayName $name
            Write-Host " Done ✓" -ForegroundColor Green
        }
    } else {
        Write-Host "Rule '$name' not found - Creating..." -NoNewline

        # Create new inbound rule
        New-NetFirewallRule `
            -DisplayName $name `
            -Direction Inbound `
            -Protocol $portInfo.Protocol `
            -LocalPort $port `
            -Action Allow `
            -Profile Domain,Private,Public `
            -Enabled True `
            | Out-Null

        Write-Host " Done ✓" -ForegroundColor Green
    }

    Write-Host ""
}

Write-Host "=== Current Firewall Rules for Smartify ===" -ForegroundColor Cyan
Get-NetFirewallRule -DisplayName "Smartify*" | Select-Object DisplayName, Enabled, Direction, Action | Format-Table -AutoSize

Write-Host ""
Write-Host "=== Firewall Profile Status ===" -ForegroundColor Cyan
$profiles = Get-NetFirewallProfile | Select-Object Name, Enabled
foreach ($profile in $profiles) {
    $status = if ($profile.Enabled) { "ON" } else { "OFF" }
    $color = if ($profile.Enabled) { "Green" } else { "Red" }
    Write-Host "$($profile.Name): " -NoNewline
    Write-Host $status -ForegroundColor $color
}

Write-Host ""
Write-Host "=== Testing Port Accessibility ===" -ForegroundColor Yellow
Write-Host ""

# Get Windows network IP
$windowsIP = Get-NetIPAddress -AddressFamily IPv4 |
    Where-Object {
        ($_.InterfaceAlias -like "*Wi-Fi*" -or $_.InterfaceAlias -like "*Ethernet*") -and
        $_.IPAddress -notlike "169.254.*" -and
        $_.IPAddress -notlike "127.*" -and
        $_.IPAddress -notlike "172.1*"
    } |
    Select-Object -First 1

if ($windowsIP) {
    Write-Host "Your Windows IP: $($windowsIP.IPAddress)" -ForegroundColor Green
    Write-Host ""
    Write-Host "Mobile Access URLs (use these on your phone):" -ForegroundColor Cyan
    Write-Host "  Customer Portal: http://$($windowsIP.IPAddress):5173/apply" -ForegroundColor White
    Write-Host "  Agent Portal:    http://$($windowsIP.IPAddress):5173/agent" -ForegroundColor White
    Write-Host "  API Docs:        http://$($windowsIP.IPAddress):5173/api/docs" -ForegroundColor White
} else {
    Write-Host "Could not detect network IP" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== Quick Firewall Test ===" -ForegroundColor Yellow
Write-Host ""
Write-Host "To test if ports are open, run this on your mobile browser:" -ForegroundColor Gray
Write-Host "  http://$($windowsIP.IPAddress):5173/" -ForegroundColor White
Write-Host ""

Write-Host "=== Additional Firewall Options ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Temporarily disable firewall (for testing only):" -ForegroundColor Yellow
Write-Host "   Set-NetFirewallProfile -Profile Private -Enabled False" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Re-enable firewall:" -ForegroundColor Yellow
Write-Host "   Set-NetFirewallProfile -Profile Private -Enabled True" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Remove Smartify firewall rules:" -ForegroundColor Yellow
Write-Host "   Remove-NetFirewallRule -DisplayName 'Smartify*'" -ForegroundColor Gray
Write-Host ""

Write-Host "=== Summary ===" -ForegroundColor Green
Write-Host ""
Write-Host "✓ Firewall rules created/verified for ports: 5173, 5001, 5000" -ForegroundColor Green
Write-Host "✓ Rules enabled for Domain, Private, and Public profiles" -ForegroundColor Green
Write-Host "✓ Inbound connections allowed" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Make sure dev server is running: npm run dev" -ForegroundColor White
Write-Host "2. Make sure port forwarding is set up (WSL2): .\setup-wsl-port-forwarding.ps1" -ForegroundColor White
Write-Host "3. Connect mobile to same WiFi network" -ForegroundColor White
Write-Host "4. Access http://$($windowsIP.IPAddress):5173/apply from mobile" -ForegroundColor White
Write-Host ""

Read-Host "Press Enter to exit"
