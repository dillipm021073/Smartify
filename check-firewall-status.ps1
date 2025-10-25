# Check Windows Firewall Status
# Can be run without Administrator privileges

Write-Host "`n=== Windows Firewall Status Check ===" -ForegroundColor Cyan
Write-Host ""

# Check firewall profiles
Write-Host "Firewall Profiles:" -ForegroundColor Yellow
$profiles = Get-NetFirewallProfile | Select-Object Name, Enabled
foreach ($profile in $profiles) {
    $status = if ($profile.Enabled) { "ENABLED (Active)" } else { "DISABLED" }
    $color = if ($profile.Enabled) { "Red" } else { "Green" }
    Write-Host "  $($profile.Name): " -NoNewline
    Write-Host $status -ForegroundColor $color
}
Write-Host ""

# Check if specific rules exist
Write-Host "Checking Smartify Firewall Rules:" -ForegroundColor Yellow
$rules = Get-NetFirewallRule -DisplayName "Smartify*" -ErrorAction SilentlyContinue

if ($rules) {
    foreach ($rule in $rules) {
        $status = if ($rule.Enabled) { "✓ Enabled" } else { "✗ Disabled" }
        $color = if ($rule.Enabled) { "Green" } else { "Red" }
        Write-Host "  $($rule.DisplayName): " -NoNewline
        Write-Host $status -ForegroundColor $color
    }
} else {
    Write-Host "  No Smartify rules found! " -ForegroundColor Red
    Write-Host "  Run fix-windows-firewall.ps1 as Administrator to create rules" -ForegroundColor Yellow
}
Write-Host ""

# Check WSL2 rules
Write-Host "Checking WSL2 Port Forwarding Rules:" -ForegroundColor Yellow
$wslRules = Get-NetFirewallRule -DisplayName "WSL*" -ErrorAction SilentlyContinue

if ($wslRules) {
    foreach ($rule in $wslRules) {
        $status = if ($rule.Enabled) { "✓ Enabled" } else { "✗ Disabled" }
        $color = if ($rule.Enabled) { "Green" } else { "Red" }
        Write-Host "  $($rule.DisplayName): " -NoNewline
        Write-Host $status -ForegroundColor $color
    }
} else {
    Write-Host "  No WSL2 port forwarding rules found" -ForegroundColor Yellow
    Write-Host "  Run setup-wsl-port-forwarding.ps1 as Administrator to create rules" -ForegroundColor Yellow
}
Write-Host ""

# Get network IP
Write-Host "Your Network IP Address:" -ForegroundColor Yellow
$windowsIP = Get-NetIPAddress -AddressFamily IPv4 |
    Where-Object {
        ($_.InterfaceAlias -like "*Wi-Fi*" -or $_.InterfaceAlias -like "*Ethernet*") -and
        $_.IPAddress -notlike "169.254.*" -and
        $_.IPAddress -notlike "127.*" -and
        $_.IPAddress -notlike "172.1*"
    } |
    Select-Object -First 1

if ($windowsIP) {
    Write-Host "  IP: " -NoNewline
    Write-Host $windowsIP.IPAddress -ForegroundColor Green
    Write-Host "  Adapter: $($windowsIP.InterfaceAlias)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Mobile URL: http://$($windowsIP.IPAddress):5173/apply" -ForegroundColor Cyan
} else {
    Write-Host "  Could not detect network IP!" -ForegroundColor Red
}
Write-Host ""

# Check port forwarding
Write-Host "Port Forwarding Status (WSL2):" -ForegroundColor Yellow
$portProxy = netsh interface portproxy show v4tov4

if ($portProxy -match "5173") {
    Write-Host "  ✓ Port 5173 forwarding active" -ForegroundColor Green
} else {
    Write-Host "  ✗ Port 5173 NOT forwarded" -ForegroundColor Red
    Write-Host "    Run setup-wsl-port-forwarding.ps1 as Administrator" -ForegroundColor Yellow
}

if ($portProxy -match "5001") {
    Write-Host "  ✓ Port 5001 forwarding active" -ForegroundColor Green
} else {
    Write-Host "  ✗ Port 5001 NOT forwarded" -ForegroundColor Red
}
Write-Host ""

# Summary
Write-Host "=== Summary ===" -ForegroundColor Cyan
Write-Host ""

$issues = @()

if (-not $rules) {
    $issues += "Firewall rules not created"
}

if ($rules -and ($rules | Where-Object { -not $_.Enabled })) {
    $issues += "Some firewall rules are disabled"
}

if (-not ($portProxy -match "5173")) {
    $issues += "Port forwarding not set up"
}

if ($profiles | Where-Object { $_.Name -eq "Private" -and $_.Enabled }) {
    # Firewall is enabled (blocking by default)
}

if ($issues.Count -eq 0) {
    Write-Host "✓ Everything looks good!" -ForegroundColor Green
} else {
    Write-Host "Issues found:" -ForegroundColor Red
    foreach ($issue in $issues) {
        Write-Host "  • $issue" -ForegroundColor Yellow
    }
    Write-Host ""
    Write-Host "Run fix-windows-firewall.ps1 as Administrator to fix these issues" -ForegroundColor Cyan
}
Write-Host ""
