Disaster Management & Alert System

A Role-Based Web Application for Emergency Monitoring and Response

Abstract:

The Disaster Management & Alert System is a full-stack, role-based web application designed to support early warning dissemination, disaster reporting, rescue coordination, and situational awareness during natural or man-made disasters.

The system enables administrators to broadcast alerts and analyze disaster trends, citizens to report incidents and request emergency assistance, and responders to manage and resolve assigned rescue tasks.
An interactive map-based dashboard provides real-time visualization of disaster locations and alerts, improving decision-making and response efficiency.

Problem Statement:

During disaster situations, delayed communication and lack of coordination between authorities, responders, and civilians often lead to inefficient rescue operations and loss of life.

There is a need for a centralized digital platform that can:

Instantly broadcast disaster alerts

Collect real-time, ground-level disaster reports

Coordinate rescue and response activities

Provide analytical and visual insights for authorities

Proposed Solution:

This system provides a centralized and secure web-based solution with the following capabilities:

Role-based authentication and access control

Centralized disaster reporting and alert management

Real-time visualization of disaster locations

Task assignment and tracking for responders

Analytical dashboards for risk assessment and planning

User Roles and Functionalities:
Admin Module:

Secure login with administrative privileges

Broadcast disaster alerts to all users

View and manage all citizen-submitted disaster reports

Assign reports to responders

Monitor task progress and completion

Analyze disaster frequency and alert engagement

View risk assessment and analytical charts

Citizen Module:

Secure registration and login

Submit disaster reports with location details

View active disaster alerts

Search and explore locations on an interactive map

Request rescue or emergency assistance

Track the status of submitted reports

Edit profile details and change password

Responder Module:

Secure login as a responder

View assigned disaster response tasks

Coordinate rescue operations

Mark tasks as completed

Automatically remove completed tasks from active views

Key System Features:

JWT-based authentication and authorization

Role-based routing (Admin, Citizen, Responder)

Interactive disaster map using Leaflet

Real-time alert visualization

Secure password hashing using bcrypt

Profile management and password updates

Responsive and user-friendly interface

RESTful API-based architecture

Application Workflow:
Alert Flow:
Admin broadcasts a disaster alert

Alert is stored in the database

Alert is displayed on the dashboard, alerts page, and interactive map

Report Flow:

Citizen submits a disaster report

Admin reviews and assigns the report to a responder

Responder completes the assigned task

Completed task is removed from active admin and responder views

Technology Stack:
Frontend:

React.js

React Router

Context API

Leaflet.js (Map Visualization)

Chart.js (Analytics and Graphs)

Custom CSS

Backend:

Node.js

Express.js

MongoDB

Mongoose

JWT Authentication

bcrypt.js

Security Implementation:

Password hashing using bcrypt

JWT-based token authentication

Middleware-protected backend routes

Role validation before sensitive operations

Secure handling of authentication tokens

Analytics and Visualization:

Disaster count analysis by location

Alert engagement tracking

Identification of high-risk areas

Interactive bar and pie charts

Future Enhancements:

Push notifications via SMS and Email

Real-time updates using WebSockets

AI-based disaster prediction models

Mobile application integration

GIS-based heatmap visualization

Academic Relevance:

Demonstrates full-stack web application development

Implements a real-world problem-solving use case

Covers authentication, authorization, APIs, database design, and UI/UX

Suitable for mini projects, major projects, and internship evaluations

Developer Details:

Name: Afreen

Branch: B.Tech – Computer Science and Engineering

Project Type: Internship Project

License:

This project is developed strictly for educational and academic purposes and is not intended for commercial use.
