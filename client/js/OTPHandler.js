"use strict";
var nodemailer = require("nodemailer");
var OTPHandler = (function () {
    function OTPHandler() {
        this.transport = nodemailer.createTransport({
            host: "debugmail.io",
            port: 25,
            auth: {
                user: "vinaybedre@gmail.com",
                pass: "0c853550-e890-11e6-9f88-e585862dca14"
            }
        });
    }
    OTPHandler.prototype.generateOTP = function (email) {
        if (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            //generateOTP
            this.otp = Math.floor(Math.random() * 899999 + 100000);
            var mailOptions_1 = {
                from: 'Swetha Phatke <swethaphatke@gmail.com>',
                to: email,
                subject: "OTP For Login",
                html: 'Your OTP for login is ' + this.otp
            };
            this.transport.sendMail(mailOptions_1, function (error, info) {
                if (error) {
                    console.log(error);
                    alert('OTP Sending Failed. Check your intenet connection');
                }
                else {
                    console.log('Message sent: ' + info.response);
                    alert('OTP sent to ' + email + '. Please login using OTP');
                }
            });
        }
        else {
            alert('Invalid E Mail');
            return;
        }
    };
    OTPHandler.prototype.validateOTP = function (otp) {
        if (otp == this.otp) {
            alert('OTP validated');
        }
        else {
            alert('Incorrect OTP entered. Please check');
        }
    };
    return OTPHandler;
}());
var otph = new OTPHandler();
