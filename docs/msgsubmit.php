<?php

if ($_POST['send'] == "send") {

    // Configuration section:
    $recipient_email      = 'info@goodwillliving.com';
    $namefield            = 'name';
    $emailfield           = 'email';
    $confirmemailfield    = 'confirmemail';
    $messagefield         = 'message';

    $email_empty_msg      = "Please complete the email field.";
    $email_mismatch_msg   = "The email addresses you've provided don't match.";
    $email_invalid_msg    = "You've provided an email address, but it isn't valid.";
    $name_missing_msg     = "You've forgotten to type your name.";
    $mail_fail_msg        = "There was a problem sending your message. Please contact Goodwill Living using the details above.";
    $mail_success_msg     = "Message Sent!";

    // // One of the email fields is empty so display an error message
    // if (($_POST[$emailfield] == "") || ($_POST[$confirmemailfield] == "")) {
    //     $error = $email_empty_msg;
    // 
    // // The two email address fields don't match
    // } elseif (0 != strcmp($_POST[$emailfield], $_POST[$confirmemailfield])) {
    //     $error = $email_mismatch_msg;

    // Email field is empty so display an error message
    if ($_POST[$emailfield] == "") {
         $error = $email_empty_msg;

    // Email address not valid
    } elseif (!preg_match("/^[a-z0-9][a-z0-9\_\-\.]*\@[a-z0-9\-\.]+\.[a-z]+$/i", trim($_POST[$emailfield]))) {
        $error = $email_invalid_msg;

    // No name provided
    } elseif (!$_POST[$namefield]) {
        $error =    $name_missing_msg;

    // All the checks pass, so we can send the customer's message
    } else {
    
        $subject = "Email via goodwillliving.co.uk website";
        $footer = "\r\n------------------------------------------\r\nEmail sent via the goodwillliving.co.uk website\r\n";
        $created = $modified = date("d/m/Y H:i");

        if ($_POST[$namefield] == "") {
            $from = $_POST[$emailfield];    
        } else {
            $from = stripslashes($_POST[$namefield]) . "<" . $_POST[$emailfield] . ">";
        }

        $headers = "From: " . $from . "\r\n";
        $headers .= "Date: " . gmdate("D, j M Y H:i:s") . " (GMT)\r\n";
        $message = $_POST[$messagefield] . "\r\n\r\n" . $headers ;

        $result = mail($recipient_email, stripslashes($subject), stripslashes($message) . $footer, $headers);
        if ($result) {
            $resultMessage = $mail_success_msg;
        } else {
            $resultMessage = $mail_fail_msg;
        }
    }
}

$mail = true;
include("contact-for-lofts-extensions-kitchens-in-ealing-and-west-london.php");
?>
