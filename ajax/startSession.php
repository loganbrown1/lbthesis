<?php
session_start();
if (empty($_SESSION["existing"])) {
    $_SESSION["existing"] = true;
} else {
    session_regenerate_id(true);
    $_SESSION["existing"] = true;
}
