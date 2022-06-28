<?php

$conn = new mysqli("localhost", "W01109652", "Logancs!", "W01109652");

$result = $conn->query("SELECT ratings.*, images.link, recipes.title
                                FROM ratings
                                LEFT JOIN images on ratings.imageID = images.imageID
                                LEFT JOIN recipes on images.recipeID = recipes.recipeID");

if(!$result){
    http_response_code(500);
}

$rows = array();
while($r = mysqli_fetch_assoc($result)) {
    $rows[] = $r;
}

$conn->close();

echo(json_encode($rows));