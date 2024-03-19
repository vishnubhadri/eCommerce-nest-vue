CREATE DATABASE IF NOT EXISTS `ecommerce`; 

USE `ecommerce`;

CREATE TABLE IF NOT EXISTS `users` (id UUID PRIMARY KEY, email VARCHAR(255), password_hash VARCHAR(25), created_at TIMESTAMP, updated_at TIMESTAMP);

CREATE TABLE IF NOT EXISTS `categories` (id UUID PRIMARY KEY, name VARCHAR(20), description VARCHAR(255), created_at TIMESTAMP, updated_at TIMESTAMP);

CREATE TABLE IF NOT EXISTS `user_interests` (id UUID PRIMARY KEY, user_id UUID, category_id UUID, selected BOOLEAN, created_at TIMESTAMP, updated_at TIMESTAMP, FOREIGN KEY (user_id) REFERENCES `users` (id), FOREIGN KEY (category_id) REFERENCES `categories` (id));