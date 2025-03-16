<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class PasswordMail extends Mailable
{
    use Queueable, SerializesModels;

    public $password;
    public $name;

    /**
     * Create a new message instance.
     */
    public function __construct($password, $name)
    {
        $this->password = $password;
        $this->name = $name;
    }

    public function build()
    {
        return $this->view('emails.password');
    }
}