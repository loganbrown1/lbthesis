<?php
//$regex = "/URL:\s*(.*recipe\/(\d*)\/*[^\s]*)[\S\s]*Title:\s*(.*)[\S\s]*Image:\s*([^\s]*)\s*[\S\s]*Number of ratings:\s*(.*)[\S\s]*Number of stars:\s*([^\s]*)\s/gm";
$regex = "/URL:\s*(.*recipe\/(\d*)\/*[^\s]*)[\S\s]*Title:\s*(.*)[\S\s]*Image:\s*([^\s]*)\s*[\S\s]*Number of ratings:\s*(.*)[\S\s]*Number of stars:\s*([^\s]*)\s/";

$conn = new mysqli("localhost", "W01109652", "Logancs!", "W01109652");

$iterator = new FilesystemIterator("recipes");
foreach ($iterator as $fileInfo) {
//    echo $fileInfo->getFilename() , "<br>";
    $file = file_get_contents("recipes/" . $fileInfo->getFilename());
//    echo "<br><br>", $file, "<br><br>";
    $matches = [];
    preg_match($regex, $file, $matches);

    if ($matches[4] == 'https://images.media-allrecipes.com/images/79590.png'
        || $matches[4] == 'NA'
        || $matches[5] == 'NA')
        continue;
    $numRatings = trim(substr($matches[5], 0, -7));

    $sql = "INSERT INTO recipes (recipeLink, recipeID, title, imageLink, numRatings, numStars)
             VALUES('$matches[1]', $matches[2], '$matches[3]', '$matches[4]', $numRatings, $matches[6])";
    $conn->query($sql);

//    break;
}

echo "done!";

$conn->close();