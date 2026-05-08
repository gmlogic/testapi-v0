param([string]$msg = "deploy")
git add -A
git commit -m $msg
$branch = git rev-parse --abbrev-ref HEAD
git push origin $branch
Write-Host "Done."
