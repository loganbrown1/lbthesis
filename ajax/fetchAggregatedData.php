<?php

$conn = new mysqli("localhost", "W01109652", "Logancs!", "W01109652");

$result = $conn->query("SELECT ratings.imageID, COUNT(*) as numRatings, AVG(ratings.rating) as imageRating, i.link, r.title
                                FROM ratings
                                    LEFT JOIN images i on ratings.imageID = i.imageID
                                    LEFT JOIN recipes r on i.recipeID = r.recipeID
                                GROUP BY ratings.imageID, i.link, r.title, r.numStars;");

if(!$result){
    http_response_code(500);
}

$rows = array();
while($r = mysqli_fetch_assoc($result)) {
    $rows[] = $r;
}

$conn->close();

echo(json_encode($rows));