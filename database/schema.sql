
/* created database */
create database driver_tickets_db
use driver_tickets_db



/** creates users table **/
create table users (user_id varchar(155) unique primary key)


/** creates answers table **/
create table answeredTickets (user_id varchar(155), ticketId int , answerId int , correctId int )

/** creates saved tickets table **/
create table savedtickets (user_id varchar(155), ticket_id int)