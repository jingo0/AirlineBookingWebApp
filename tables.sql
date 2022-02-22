DROP TABLE IF EXISTS airport_info CASCADE;
DROP TABLE IF EXISTS flights_info CASCADE;
DROP TABLE IF EXISTS flight_details CASCADE;
DROP TABLE IF EXISTS passenger CASCADE;
DROP TABLE IF EXISTS booking CASCADE;
DROP TABLE IF EXISTS ticket CASCADE;
DROP TABLE IF EXISTS ticket_flights CASCADE;
DROP SEQUENCE IF EXISTS order_book_ref CASCADE;
DROP SEQUENCE IF EXISTS order_ticket_no CASCADE;
DROP SEQUENCE IF EXISTS order_passenger_id CASCADE;
DROP TABLE IF EXISTS payment CASCADE;
DROP TABLE IF EXISTS checkin CASCADE;
DROP SEQUENCE IF EXISTS order_baggage_claim CASCADE;
DROP SEQUENCE IF EXISTS order_boarding_pass CASCADE;


CREATE TABLE airport_info (
    airport_code char(3) NOT NULL,
    airport_name char(40),
    city char(20),
    PRIMARY KEY (airport_code)
);

CREATE TABLE flights_info (
    flight_id integer NOT NULL,
    flight_no character(6) NOT NULL,
    scheduled_departure timestamp NOT NULL,
    scheduled_arrival timestamp NOT NULL,
    departure_airport character(3) NOT NULL,
    arrival_airport character(3) NOT NULL,
    STATUS character varying(20) NOT NULL,
    aircraft_code character(3) NOT NULL,
    seats_available integer NOT NULL,
    seats_booked integer NOT NULL,
    gate_no character(1) NOT NULL,
    PRIMARY KEY (flight_id)
);

CREATE TABLE flight_details (
    flight_id integer NOT NULL,
    flight_no character(6) NOT NULL,
    fare_conditions character varying(10) NOT NULL,
    amount numeric(10, 2) NOT NULL,
    PRIMARY KEY (flight_id, flight_no, fare_conditions)
);

CREATE TABLE passenger (
    passenger_id integer,
    first_name varchar(20) NOT NULL,
    last_name varchar(20) NOT NULL,
    email char(50),
    phone char(15),
    password varchar(30) NOT NULL,
    PRIMARY KEY(passenger_id)
);

CREATE SEQUENCE order_passenger_id
START 1
INCREMENT 1
MINVALUE 1
OWNED BY passenger.passenger_id;

CREATE TABLE booking (
    book_ref integer NOT NULL,
    book_date timestamp NOT NULL,
    total_amount numeric(10,2) NOT NULL,
    PRIMARY KEY(book_ref)
);

CREATE SEQUENCE order_book_ref
START 100000
INCREMENT 1
MINVALUE 10
OWNED BY booking.book_ref;

CREATE TABLE ticket (
    ticket_no integer NOT NULL,
    book_ref SERIAL,
    passenger_id SERIAL,
    PRIMARY KEY(ticket_no),
    CONSTRAINT "ticket_book_ref_fkey" FOREIGN KEY (book_ref) REFERENCES booking(book_ref),
    CONSTRAINT "ticket_passenger_id_fkey" FOREIGN KEY (passenger_id) REFERENCES passenger(passenger_id)
);

CREATE TABLE ticket_flights (
	ticket_no integer NOT NULL,
	flight_id INTEGER  NOT NULL,
	class character varying (10) NOT NULL,
	amount numeric (10,2) NOT NULL
);

CREATE SEQUENCE order_ticket_no
START 10000000
INCREMENT 1
MINVALUE 100
OWNED BY ticket.ticket_no;

CREATE TABLE payment (
    book_ref integer NOT NULL,
    passenger_id integer NOT NULL,
    card_no character varying (16) NOT NULL,
    exp_month character varying (2) NOT NULL,
    exp_yaer character varying (4) NOT NULL,
    total_amount numeric (10,2) NOT NULL,
    CONSTRAINT "payment_book_ref_fkey" FOREIGN KEY (book_ref) REFERENCES booking(book_ref),
    CONSTRAINT "payment_passenger_id_fkey" FOREIGN KEY (passenger_id) REFERENCES passenger(passenger_id)
);

CREATE TABLE checkin (
    baggage_claim integer NOT NULL,
    boarding_no integer NOT NULL,
    book_ref integer NOT NULL,
    ticket_no integer NOT NULL,
    passenger_id integer NOT NULL,
    no_of_bag char(2) NOT NULL,
    status char(1) NOT NULL,
    PRIMARY KEY(baggage_claim),
    CONSTRAINT "checkin_book_ref_fkey" FOREIGN KEY (book_ref) REFERENCES booking(book_ref),
    CONSTRAINT "checkin_ticket_no_fkey" FOREIGN KEY (ticket_no) REFERENCES ticket(ticket_no),
    CONSTRAINT "checkin_passenger_id_fkey" FOREIGN KEY (passenger_id) REFERENCES passenger(passenger_id)

);
CREATE SEQUENCE order_baggage_claim
START 11000000
MINVALUE 11000000
OWNED BY checkin.baggage_claim;

CREATE SEQUENCE order_boarding_pass
START 50000000
MINVALUE 50000000
OWNED BY checkin.boarding_no;

/* INSERT VALUES */
/*airport table */
INSERT INTO airport_info
VALUES (
        'HOU',
        'George Bush Airport',
        'houston'
    );

INSERT INTO airport_info
VALUES (
        'JFK',
        'John F Kennedy Airport',
        'newyork'
    );

INSERT INTO airport_info
VALUES ( 
        'LAX',
        'Los Angeles Airport',
        'losangeles'
    );

INSERT INTO airport_info
VALUES (
	'ORD',
	'O Hare Airport',
	'chicago'
    );

INSERT INTO airport_info
VALUES (
	'MIA',
	'Miami Airport',
	'miami'
    );


/*flights table*/
INSERT INTO flights_info
VALUES (
        1001,
        'PG0010',
        '2021-12-10 09:50:00',
        '2021-12-10 14:55:00',
        'HOU',
        'JFK',
        'Scheduled',
        '773',
        50,
        0,
        'A'
    );

INSERT INTO flights_info
VALUES (
        1002,
        'PG0020',
        '2021-12-10 09:50:00',
        '2021-12-10 15:55:00',
        'LAX',
        'JFK',
        'Scheduled',
        '763',
        50,
        0,
        'F'
    );

INSERT INTO flights_info
VALUES (
        1003,
        'PG0030',
        '2021-12-10 09:50:00',
        '2021-12-10 16:55:00',
        'ORD',
        'MIA',
        'Scheduled',
        'SU9',
        50,
        0,
	'B'
    );

INSERT INTO flights_info
VALUES (
        1004,
        'PG0040',
        '2021-12-10 09:50:00',
        '2021-12-10 12:55:00',
        'JFK',
        'ORD',
        'Scheduled',
        '320',
        50,
        0,
	'H'
    );

INSERT INTO flights_info
VALUES (
        1005,
        'PG0050',
        '2021-12-10 09:50:00',
        '2021-12-10 12:55:00',
        'MIA',
        'LAX',
        'Scheduled',
        '321',
        50,
        0,
	'D'
    );

INSERT INTO flights_info
VALUES (
        1006,
        'PG0060',
        '2021-12-10 09:50:00',
        '2021-12-10 12:55:00',
        'JFK',
        'HOU',
        'Scheduled',
        '773',
        50,
        0,
	'C'
    );

INSERT INTO flights_info
VALUES (
        1007,
        'PG0070',
        '2021-12-10 17:50:00',
        '2021-12-10 20:55:00',
        'JFK',
        'LAX',
        'Scheduled',
        '763',
        50,
        0,
	'A'
    );

INSERT INTO flights_info
VALUES (
        1008,
        'PG0080',
        '2021-12-10 09:50:00',
        '2021-12-10 12:55:00',
        'MIA',
        'ORD',
        'Scheduled',
        'SU9',
        50,
        0,
	'A'
    );

INSERT INTO flights_info
VALUES (
        1009,
        'PG0090',
        '2021-12-10 09:50:00',
        '2021-12-10 12:55:00',
        'ORD',
        'JFK',
        'Scheduled',
        '320',
        50,
        0,
	'B'
    );

INSERT INTO flights_info
VALUES (
        1010,
        'PG0100',
        '2021-12-10 09:50:00',
        '2021-12-10 12:55:00',
        'LAX',
        'MIA',
        'Scheduled',
        '321',
        50,
        0,
	'D'
    );

INSERT INTO flights_info
VALUES(
	1011,
	'PG0110',
	'2021-12-10 08:30:00',
	'2021-12-10 10:30:00',
	'ORD',
	'MIA',
	'Scheduled',
	'322',
	50,
	0,
	'H'
    );

INSERT INTO flights_info
VALUES(
	1012,
	'PG0120',
	'2021-12-10 11:00:00',
	'2021-12-10 12:50:00',
	'MIA',
	'LAX',
	'Scheduled',
	'323',
	50,
	0,
	'B'
    );

INSERT INTO flights_info
VALUES(
	1013,
	'PG0130',
	'2021-12-10 07:15:00',
	'2021-12-10 09:45:00',
	'LAX',
	'MIA',
	'Scheduled',
	'324',
	50,
	0,
	'C'
    );

INSERT INTO flights_info
VALUES(
	1014,
	'PG0140',
	'2021-12-10 10:15:00',
	'2021-12-10 12:30:30',
	'MIA',
	'JFK',
	'Scheduled',
	'325',
	50,
	0,
	'A'
    );

INSERT INTO flight_details
VALUES (
        1001,
        'PG0010',
        'economy',
        '70.00'
);

INSERT INTO flight_details
VALUES (
        1002,
        'PG0020',
        'economy',
        '70.00'
);

INSERT INTO flight_details
VALUES (
        1003,
        'PG0030',
        'economy',
        '70.00'
);

INSERT INTO flight_details
VALUES (
        1004,
        'PG0040',
        'economy',
        '70.00'
);

INSERT INTO flight_details
VALUES (
        1005,
        'PG0050',
        'economy',
        '70.00'
);

INSERT INTO flight_details
VALUES (
        1006,
        'PG0060',
        'economy',
        '70.00'
);

INSERT INTO flight_details
VALUES (
        1007,
        'PG0070',
        'economy',
        '70.00'
);

INSERT INTO flight_details
VALUES (
        1008,
        'PG0080',
        'economy',
        '70.00'
);

INSERT INTO flight_details
VALUES (
        1009,
        'PG0090',
        'economy',
        '70.00'
);

INSERT INTO flight_details
VALUES (
        1010,
        'PG0100',
        'economy',
        '70.00'
);

INSERT INTO flight_details
VALUES (
	1011,
	'PG0110',
	'economy',
	'80.00'
);

INSERT INTO flight_details
VALUES (
	1012,
	'PG0120',
	'economy',
	'80.00'
);

INSERT INTO flight_details
VALUES (
	1013,
	'PG0130',
	'economy',
	'70.00'
);

INSERT INTO flight_details
VALUES (
	1014,
	'PG0140',
	'economy',
	'65.00'
);

INSERT INTO flight_details
VALUES (
        1001,
        'PG0010',
        'business',
        '120.00'
);

INSERT INTO flight_details
VALUES (
        1002,
        'PG0020',
        'business',
        '120.00'
);

INSERT INTO flight_details
VALUES (
        1003,
        'PG0030',
        'business',
        '120.00'
);

INSERT INTO flight_details
VALUES (
        1004,
        'PG0040',
        'business',
        '120.00'
);

INSERT INTO flight_details
VALUES (
        1005,
        'PG0050',
        'business',
        '120.00'
);

INSERT INTO flight_details
VALUES (
        1006,
        'PG0060',
        'business',
        '120.00'
);

INSERT INTO flight_details
VALUES (
        1007,
        'PG0070',
        'business',
        '120.00'
);

INSERT INTO flight_details
VALUES (
        1008,
        'PG0080',
        'business',
        '120.00'
);

INSERT INTO flight_details
VALUES (
        1009,
        'PG0090',
        'business',
        '120.00'
);

INSERT INTO flight_details
VALUES (
        1010,
        'PG0100',
        'business',
        '120.00'
);

INSERT INTO flight_details
VALUES (
	1011,
	'PG0110',
	'business',
	'130.00'
);

INSERT INTO flight_details
VALUES (
	1012,
	'PG0120',
	'business',
	'120.00'
);

INSERT INTO flight_details
VALUES (
	1013,
	'PG0130',
	'business',
	'110.00'
);

INSERT INTO flight_details
VALUES (
	1014,
	'PG0140',
	'business',
	'100.00'
);

INSERT INTO passenger 
VALUES(nextval('order_passenger_id'),'Erik', 'Herbert', 'erikh3213', '9364469690', 'Qnfj12Kss');

INSERT INTO passenger 
VALUES(nextval('order_passenger_id'),'Ash', 'Ketchum', 'gottacatchemall@pokemon.com', '7151569665', 'PIKAPIKA');

INSERT INTO passenger 
VALUES(nextval('order_passenger_id'),'The Rock', 'Hard', 'theRock@wwe.com', '4568981235', 'eAtRoCkS');

INSERT INTO passenger 
VALUES(nextval('order_passenger_id'),'Carlos', 'Ordonez', 'cordonez@uh.edu', '7138559692', 'dbs000');

INSERT INTO passenger 
VALUES(nextval('order_passenger_id'),'Beyonce', 'Knowles', 'beyhive@gmail.com', '8254459690', 'PutaRingOnIt');

INSERT INTO passenger 
VALUES(nextval('order_passenger_id'),'Michelle', 'Obama', 'formerFirstLady@us.gov', '1111111111', 'ILuvBarack<3');

INSERT INTO passenger 
VALUES(nextval('order_passenger_id'),'Doja', 'Cat', 'kittakat@doja.com', '1568954568', 'b*t*hImACow');

INSERT INTO passenger 
VALUES(nextval('order_passenger_id'),'Nouhad', 'Rizk', 'njRizk@uh.edu', '7135648569', 'makeCSmajorsCry');

INSERT INTO passenger 
VALUES(nextval('order_passenger_id'),'Donald', 'Trump', 'donaldtrump@us.gov', '1784589584', 'BuildTheWall');

INSERT INTO passenger 
VALUES(nextval('order_passenger_id'),'Bernie', 'Sanders', 'berniesanders@us.gov', '9875642536', 'Medicare4AllNOW');
