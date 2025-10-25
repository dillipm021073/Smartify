# PowerShell script to get Windows network IP addresses
# Run this in Windows PowerShell (not WSL)

Write-Host "`n=== Windows Network IP Addresses ===" -ForegroundColor Cyan
Write-Host ""

# Get all network adapters with IPv4 addresses
$adapters = Get-NetIPAddress -AddressFamily IPv4 |
    Where-Object { $_.InterfaceAlias -notlike "*Loopback*" -and $_.InterfaceAlias -notlike "*WSL*" } |
    Select-Object InterfaceAlias, IPAddress, PrefixLength

foreach ($adapter in $adapters) {
    Write-Host "Interface: " -NoNewline
    Write-Host $adapter.InterfaceAlias -ForegroundColor Yellow
    Write-Host "IP Address: " -NoNewline
    Write-Host $adapter.IPAddress -ForegroundColor Green
    Write-Host ""
}

# Show WiFi IP specifically
$wifiIP = Get-NetIPAddress -AddressFamily IPv4 |
    Where-Object {
        ($_.InterfaceAlias -like "*Wi-Fi*" -or $_.InterfaceAlias -like "*Wireless*") -and
        $_.IPAddress -notlike "169.254.*" -and
        $_.IPAddress -notlike "127.*" -and
        $_.IPAddress -notlike "172.1*"
    } |
    Select-Object -First 1

if ($wifiIP) {
    Write-Host "=== Your WiFi IP (use this for mobile) ===" -ForegroundColor Cyan
    Write-Host $wifiIP.IPAddress -ForegroundColor Green
    Write-Host ""
    Write-Host "Mobile URL for Vite Dev Server (port 5173):" -ForegroundColor Yellow
    Write-Host "http://$($wifiIP.IPAddress):5173/apply" -ForegroundColor White
    Write-Host ""
    Write-Host "Agent Portal URL:" -ForegroundColor Yellow
    Write-Host "http://$($wifiIP.IPAddress):5173/agent" -ForegroundColor White
    Write-Host ""
    Write-Host "Note: Make sure to run setup-wsl-port-forwarding.ps1 if using WSL2" -ForegroundColor Gray
} else {
    Write-Host "No WiFi adapter found. Checking Ethernet..." -ForegroundColor Yellow
    $ethIP = Get-NetIPAddress -AddressFamily IPv4 |
        Where-Object {
            $_.InterfaceAlias -like "*Ethernet*" -and
            $_.IPAddress -notlike "169.254.*" -and
            $_.IPAddress -notlike "127.*" -and
            $_.IPAddress -notlike "172.1*"
        } |
        Select-Object -First 1
    if ($ethIP) {
        Write-Host "=== Your Ethernet IP (use this for mobile) ===" -ForegroundColor Cyan
        Write-Host $ethIP.IPAddress -ForegroundColor Green
        Write-Host ""
        Write-Host "Mobile URL for Vite Dev Server:" -ForegroundColor Yellow
        Write-Host "http://$($ethIP.IPAddress):5173/apply" -ForegroundColor White
    } else {
        Write-Host "No suitable network adapter found!" -ForegroundColor Red
    }
}
