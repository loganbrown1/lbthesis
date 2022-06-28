<?php

$conn = new mysqli("localhost", "W01109652", "Logancs!", "W01109652");

session_start();

$rest_json = file_get_contents("php://input");
$rating = json_decode($rest_json, true);
$session_id = session_id();
$image_id = $rating['imageID'];
$rating_value = $rating['ratingValue'];
$problem = $rating['problem'];
$reason = $rating['reason'] ?? '';

$sql = "INSERT INTO ratings (sessionID, imageID, rating, problem, reason) 
             VALUES('$session_id', $image_id, $rating_value, $problem, '$reason')";

$conn->query($sql);

$conn->close();

