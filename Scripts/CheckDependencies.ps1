# Call the script with the path to the project directory as an argument:
#     .\build-panel.ps1 "C:\Projects\gpa-gemstone\"
# Uncomment the following line to hardcode the project directory for testing
$projectDir = "D:\Projects\gpa-gemstone\"

param(
    [string]$projectDir
)

if ([string]::IsNullOrWhiteSpace($projectDir)) {
    throw "projectDir parameter was not provided, script terminated."
}

$DependencyHash = @{}
$DevDependencyHash = @{}

$Packages = "application-typings", "gpa-symbols", "helper-functions", "react-forms", "react-graph", "react-interactive", "react-table", "common-pages"

function LoadPackage($package) {
  $inDep = $false
  $inDev = $false

  $nDep = 0
  $nDevDep = 0

  echo "##### PACKAGE: $package #####"
  foreach($line in Get-Content ".\$package\package.json") {
    if($line -match "`"dependencies`": {"){
        if ($line -match "}") {
            }
        else {
            $inDep= $true
            continue
        }
    }
    If ($inDep -AND $line -match "}") {
      $inDep= $false
    }
    if ($inDep) {
      $nDep ++
      $line=$line.Trim(",")
      $item =$line.Split(":")
      if ($DependencyHash.ContainsKey($item[0].Trim())) {
        if ($DependencyHash[$item[0].Trim()] -ne $item[1].Trim()) {
            $p = $item[0].Trim()
            echo "$p is a different version than that encountered in a previous package"
            }
      }
      elseif ($DevDependencyHash.ContainsKey($item[0].Trim())) {
        $p = $item[0].Trim()
        echo "$p is specified as a Dependency here but as a DevDependency in another package"
      }
      else{
        $DependencyHash[$item[0].Trim()] = $item[1].Trim().Trim(",")
      }
    }
    
}

foreach($line in Get-Content ".\$package\package.json") {
    if($line -match "`"devDependencies`": {"){
        if ($line -match "}") {
            }
        else {
            $inDep= $true
            continue
        }
    }
    If ($inDep -AND $line -match "}") {
      $inDep= $false
    }
    if ($inDep) {
      $line=$line.Trim(",")
      $item =$line.Split(":")
      if ($DevDependencyHash.ContainsKey($item[0].Trim())) {
        if ($DevDependencyHash[$item[0].Trim()] -ne $item[1].Trim().Trim(",")) {
            $p = $item[0].Trim()
            echo "$p is a different version than that encountered in a previous package"
            }
      }
      elseif ($DependencyHash.ContainsKey($item[0].Trim())) {
        $p = $item[0].Trim()
        echo "$p is specified as a DevDependency here but as a Dependency in another package"
      }
      else{
        $DevDependencyHash[$item[0].Trim()] = $item[1].Trim().Trim(",")
      }
      $nDevDep ++
    }
    
}

echo "Found $nDevDep DevDependencies"
echo "Found $nDep Dependencies"


}

Set-Location "$projectDir"
foreach ($npmPackage in $Packages){
  LoadPackage $npmPackage
}
