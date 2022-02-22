const express = require('express')

const app = express()

const cors = require('cors');

const { Pool } = require('pg')
//const creds = require('./creds.json')

const pool = new Pool({
  host: '3380db.cs.uh.edu',
	user: 'dbs040',
	password: '2035711H',
	port: 5432,
	database: 'COSC3380'
});

var fs = require('fs');
var queries = fs.createWriteStream('queries.sql', {flags: 'a'});
var transaction = fs.createWriteStream('transaction.sql', {flags: 'a'});

app.use(express.static('public'));

//middleware
app.use(cors());
app.use(express.json()); 

//SELECT DATE(column_name) FROM table_name;

app.post('/result', async(req, res) =>{
    try{
        // const stri= '"No flight found"';
                
        const {departure, arrival, date_from, date_to, class_, flightTpyeval} = req.body;
        console.log("Searching flight from " + departure + " to " + arrival)
        
        if(flightTpyeval == "direct")
        {
          // pool.connect();
          console.log("connected")
          const Direct = await pool.query(`select f.flight_id as flight_id, f.flight_no as flight_number,scheduled_departure as Departure, scheduled_arrival as Arrival, a1.city as Departure_city, a2.city as Arrival_city, 
          a1.airport_name as Departure_airport, a2.airport_name as Arrival_airport, status as Status, (scheduled_arrival-scheduled_departure) as Duration, fd.fare_conditions as class,fd.amount as price, f.seats_available as available_seats
          from flights_info as f, airport_info as a1, airport_info as a2,flight_details as fd
          where f.departure_airport= a1.airport_code and f.arrival_airport=a2.airport_code and  a1.city like '%${departure}%' and a2.city like '%${arrival}%' 
          and f.flight_id=fd.flight_id and f.flight_no=fd.flight_no and fare_conditions like '${class_}'
          and scheduled_departure BETWEEN '${date_from} 00:00:00' AND '${date_to} 23:59:59';`)

          queries.write(`
      SELECT f.flight_id AS flight_id, f.flight_no AS flight_number, 
      scheduled_departure AS Departure, scheduled_arrival AS Arrival, 
      a1.city AS Departure_city, a2.city AS Arrival_city, 
      a1.airport_name AS Departure_airport, a2.airport_name AS Arrival_airport, status AS Status, 
      (scheduled_arrival-scheduled_departure) AS Duration, fd.fare_conditions AS class,fd.amount AS price, f.seats_available AS available_seats
      FROM flights_info AS f, airport_info AS a1, airport_info AS a2,flight_details AS fd
      WHERE f.departure_airport= a1.airport_code AND f.arrival_airport=a2.airport_code AND  a1.city LIKE '%${departure}%' AND a2.city LIKE '%${arrival}%' 
      AND f.flight_id=fd.flight_id AND f.flight_no=fd.flight_no and fare_conditions LIKE '${class_}'
      AND scheduled_departure BETWEEN '${date_from} 00:00:00' AND '${date_to} 23:59:59'; \n`
          );

          
          // pool.end();
          console.log("disconnected")
          
          res.send(Direct.rows)
        }
        else
        { 
          // pool.connect();
          console.log("connected");       
          const Indirect = await pool.query(`select f1.flight_id as first_flight_id, f1.flight_no as first_flight_no, f1.scheduled_departure as First_departure, f1.scheduled_arrival as First_arrival,a1.city as departure_city, a1.airport_name as departure_airport,
          f1.status as first_flight_status, (f1.scheduled_arrival-f1.scheduled_departure) as flight1_duration, f1.seats_available as available_seats_flight1, a3.city as layover_at, f2.flight_id as second_flight_id, f2.flight_no as second_flight_no, f2.scheduled_departure as second_departure,
          f2.scheduled_arrival as second_arrival, a2.city as arrival_city, a2.airport_name as arrival_airport, f2.status as second_flight_status, (f2.scheduled_arrival-f2.scheduled_departure) as flight2_duration,fd.fare_conditions as class, f2.seats_available as available_seats_flight2,
          2*fd.amount as price from flights_info as f1, flights_info as f2, airport_info as a1, airport_info as a2, flight_details as fd, airport_info as a3
          where f1.departure_airport = a1.airport_code and f2.arrival_airport = a2.airport_code and a1.city like '%${departure}%' 
          and a2.city like '%${arrival}%' and f1.arrival_airport=a3.airport_code and f1.arrival_airport=f2.departure_airport and f1.flight_id=fd.flight_id and f1.flight_no=fd.flight_no and fd.fare_conditions like '${class_}' 
          and f1.scheduled_departure BETWEEN '${date_from} 00:00:00' AND '${date_to} 23:59:59' 
          and f2.scheduled_departure BETWEEN '${date_from} 00:00:00' AND '${date_to} 23:59:59'
          and f1.scheduled_arrival<f2.scheduled_departure;`)          
   
          queries.write(`
      SELECT f1.flight_id AS first_flight_id, f1.flight_no AS first_flight_no, 
      f1.scheduled_departure AS First_departure, f1.scheduled_arrival AS First_arrival, 
      a1.city AS departure_city, a1.airport_name AS departure_airport,
      f1.status AS first_flight_status, (f1.scheduled_arrival-f1.scheduled_departure) AS flight1_duration, 
      f1.seats_available AS available_seats_flight1, a3.city AS layover_at, 
      f2.flight_id AS second_flight_id, f2.flight_no AS second_flight_no, f2.scheduled_departure AS second_departure,
      f2.scheduled_arrival AS second_arrival, a2.city AS arrival_city, a2.airport_name AS arrival_airport, 
      f2.status AS second_flight_status, (f2.scheduled_arrival-f2.scheduled_departure) AS flight2_duration, 
      fd.fare_conditions AS class, f2.seats_available AS available_seats_flight2,
      2*fd.amount AS price from flights_info AS f1, flights_info AS f2, 
      airport_info AS a1, airport_info AS a2, flight_details AS fd, airport_info AS a3
      WHERE f1.departure_airport = a1.airport_code AND f2.arrival_airport = a2.airport_code AND a1.city like '%${departure}%' 
      AND a2.city LIKE '%${arrival}%' AND f1.arrival_airport=a3.airport_code 
      AND f1.arrival_airport=f2.departure_airport 
      AND f1.flight_id=fd.flight_id 
      AND f1.flight_no=fd.flight_no 
      AND fd.fare_conditions like '${class_}' 
      AND f1.scheduled_departure BETWEEN '${date_from} 00:00:00' AND '${date_to} 23:59:59' 
      AND f2.scheduled_departure BETWEEN '${date_from} 00:00:00' AND '${date_to} 23:59:59'
      AND f1.scheduled_arrival<f2.scheduled_departure;\n`
          );

          // pool.end();
          console.log("disconnected")

          res.send(Indirect.rows)
        }
          /*
          if (Indirect.rowCount === 0)
            res.send(noFlight)
          else
            res.send(Indirect.rows)*/

            // res.json({
            //   direct_flights : allDemos.rows,
            //   indirect_flights : Indirect.rows
            // })
            // res.send()            

        // console.log(allDemos);
      } catch(err){
        console.log(err.message);
      }
})

app.post('/newUser', async(req, res) =>{
  try{
              
      const {firstName, lastName, email, phoneNum, password} = req.body;
      console.log("Creating new user " + firstName + " " + lastName);
      //console.log(firstName)

      // pool.connect();
      console.log("connected")
      const beg_transaction = await pool.query(`BEGIN TRANSACTION;`)
      transaction.write(`
      BEGIN TRANSACATION;\n`
      )
      const userID = await pool.query(`INSERT INTO passenger VALUES(nextval('order_passenger_id'),'${firstName}', '${lastName}', '${email}', '${phoneNum}', '${password}') RETURNING passenger_id;`);
      //const userID1 = await pool.query(`SELECT passenger_id FROM passenger WHERE first_name = '${firstName}' AND last_name = '${lastName}' AND email = '${email}' AND phone = '${phoneNum}' and password = '${password}';`);
      transaction.write(`
      INSERT INTO passenger VALUES
      (nextval('order_passenger_id'),
      '${firstName}', 
      '${lastName}', 
      '${email}', 
      '${phoneNum}', 
      '${password}') 
      RETURNING passenger_id;\n`);
      const end_transaction = await pool.query(`COMMIT TRANSACTION;`)
      transaction.write(`
      END TRANSACTION;\n`
      )
      res.send(userID.rows);

      // pool.end();
      console.log("disconnected")
      
    } catch(err){
      console.log(err.message);
    }
})

app.post('/booking', async(req, res) =>{
  try{
    
    const {flightBookedTypeval, flightId1, flightId2, noOfPeople, class_, passengers, ccn, month, year, cvv, card_holder} = req.body;
    // console.log(flightId + "\n")
    // console.log(noOfPeople + "\n")
    // console.log(class_ + "\n")
    // console.log("Passengers:");
    // for(i = 0; i < noOfPeople; i++)
    // {
    //   console.log(passengers[i]+"\n");
    // }

    
    if(flightBookedTypeval=="direct")
    {
      // pool.connect();
      console.log("connected") 
      console.log("Booking flight " + flightId1 + " for " + noOfPeople + " users");
      const beg_transaction = await pool.query(`BEGIN TRANSACTION;`)
      transaction.write(`
      BEGIN TRANSACATION;\n`
      )
      const price = await pool.query(`select amount from  flight_details as fd where fd.flight_id=${flightId1} and fd.fare_conditions like '${class_}';`);
      queries.write(`
      SELECT amount 
      FROM  flight_details AS fd 
      WHERE fd.flight_id=${flightId1} 
      AND fd.fare_conditions LIKE '${class_}';\n`
      );
      const amount = price.rows[0].amount;
      
      //console.log(amount)
      const totalAmount = amount * noOfPeople;
      //console.log(totalAmount)

      const bookRef = await pool.query(`INSERT INTO booking VALUES(nextval('order_book_ref'), current_timestamp, ${totalAmount}.00) RETURNING book_ref;`);
      //console.log(`INSERT INTO booking VALUES(nextval('order_book_ref'), current_timestamp, ${totalAmount}.00) RETURNING book_ref;`)
      transaction.write(`
      INSERT INTO booking 
      VALUES
      (nextval('order_book_ref'), 
      current_timestamp, 
      ${totalAmount}.00) 
      RETURNING book_ref;\n`
      );
      var booking = bookRef.rows[0].book_ref;
      //console.log(booking); //book_ref
      for (i = 0; i < noOfPeople; i++)
      {
        
        var ticket = await pool.query(`INSERT INTO ticket VALUES(nextval('order_ticket_no'), '${bookRef.rows[0].book_ref}', '${passengers[i]}') RETURNING ticket_no;`);
        await pool.query(`INSERT INTO ticket_flights VALUES (${ticket.rows[0].ticket_no}, ${flightId1}, '${class_}', ${amount});`);
        transaction.write(`
      INSERT INTO ticket 
      VALUES(nextval ('order_ticket_no'), 
      '${bookRef.rows[0].book_ref}', 
      '${passengers[i]}') 
      RETURNING ticket_no;\n`
        );
        transaction.write(`
      INSERT INTO ticket_flights 
      VALUES (${ticket.rows[0].ticket_no}, 
      ${flightId1}, 
      '${class_}', 
      ${amount});\n`
        );
      }
      const tickets = await pool.query(`SELECT ticket_no FROM ticket WHERE book_ref = ${bookRef.rows[0].book_ref};`);
      const pass_id = await pool.query(`SELECT passenger_id FROM ticket WHERE book_ref = ${bookRef.rows[0].book_ref};`);
      queries.write(`
      SELECT ticket_no 
      FROM ticket 
      WHERE book_ref = ${bookRef.rows[0].book_ref};\n`
      );
      queries.write(`
      SELECT passenger_id 
      FROM ticket 
      WHERE book_ref = ${bookRef.rows[0].book_ref};\n`
      );
      for(var i=0 ; i<tickets.rows.length; i++)
      {
        //console.log(tickets.rows[i].ticket_no);
      }
      /*
      for (i = 0; i < tickets.rows.length)
        await pool.query(`INSERT INTO ticket_flights VALUES (${tickets.rows[i].ticket_no}, ${flightID}, ${class_}, ${amount});`);*/
      // transcation = update and insert 
      // query = select 
      const seats = await pool.query(`SELECT seats_available from flights_info WHERE  flight_id = ${flightId1};`)
      queries.write(`
      SELECT seats_available 
      DEOM flights_info 
      WHERE  flight_id = ${flightId1};\n`
      );
      //console.log("Seats before transaction: " + seats.rows[0].seats_available)
      const remain = await pool.query(`UPDATE flights_info SET seats_available = seats_available - ${noOfPeople}, seats_booked= seats_booked + ${noOfPeople} WHERE flight_id = ${flightId1} RETURNING seats_available;`)
      transaction.write(`
      UPDATE flights_info 
      SET seats_available = seats_available - ${noOfPeople}, 
      seats_booked = seats_booked + ${noOfPeople} 
      WHERE flight_id = ${flightId1} 
      RETURNING seats_available;\n`
      );
      //console.log("Seats remaining: " + remain.rows[0].seats_available);

      //payment transaction 
      //console.log(`INSERT INTO payment VALUES (${booking}, ${passengers[0]}, '${ccn}', '${month}', '${year}', ${totalAmount});`)
      const payment = await pool.query(`INSERT INTO payment VALUES (${booking}, ${passengers[0]},'${ccn}', '${month}', '${year}', ${totalAmount});`)
      transaction.write(`
      INSERT INTO payment 
      VALUES (
      ${booking}, ${passengers[0]},
      '${ccn}', 
      '${month}', 
      '${year}', 
      ${totalAmount});\n`
      );
      const end_transaction = await pool.query(`COMMIT TRANSACTION;`)
      transaction.write(`
      COMMIT TRANSACTION;\n`
      )
      // pool.end()
      
      const result = await pool.query(`SELECT book_ref, passenger_id, ticket_no from ticket where book_ref=${booking};`)
      queries.write(`
      SELECT book_ref, passenger_id, ticket_no 
      FROM ticket 
      WHERE book_ref=${booking};\n`)
      console.log("disconnected")
      // console.log(`SELECT book_ref, passenger_id, ticket_no from ticket where book_ref=${booking};`)
      // console.log(result.rows);

      res.send(result.rows);

    }

    else
    {
      // pool.connect();
      console.log("connected") 
      console.log("Booking flights " + flightId1 + " and " + flightId2 + " for " + noOfPeople + " users"); 
      const beg_transaction = await pool.query(`BEGIN TRANSACTION;`)
      transaction.write(`
      BEGIN TRANSACATION;\n`)
      //console.log("indirect")
      const price1 = await pool.query(`select amount from  flight_details as fd where fd.flight_id=${flightId1} and fd.fare_conditions like '${class_}';`);
      queries.write(`
      SELECT amount 
      FROM  flight_details AS fd 
      WHERE fd.flight_id = ${flightId1} 
      AND fd.fare_conditions LIKE '${class_}';\n`
      );

      const price2 = await pool.query(`select amount from  flight_details as fd where fd.flight_id=${flightId1} and fd.fare_conditions like '${class_}';`);
      queries.write(`
      SELECT amount 
      FROM  flight_details AS fd 
      WHERE fd.flight_id = ${flightId1} 
      AND fd.fare_conditions LIKE '${class_}';\n`
      );
      var amount1 = parseInt(price1.rows[0].amount)
      var amount2 = parseInt(price2.rows[0].amount);
      // console.log("4")
      // console.log(amount1)
      // console.log(amount2)
      const totalAmount = (amount1+amount2) * noOfPeople;
      //console.log(totalAmount)

      const bookRef = await pool.query(`INSERT INTO booking VALUES(nextval('order_book_ref'), current_timestamp, ${totalAmount}.00) RETURNING book_ref;`);
      transaction.write(`
      INSERT INTO booking 
      VALUES(nextval('order_book_ref'), 
      current_timestamp, 
      ${totalAmount}.00) 
      RETURNING book_ref;\n`
      );
      //console.log(`INSERT INTO booking VALUES(nextval('order_book_ref'), current_timestamp, ${totalAmount}.00) RETURNING book_ref;`)
      var booking = bookRef.rows[0].book_ref; //book_ref
      //console.log(booking);
      for (i = 0; i < noOfPeople; i++)
      {
        var ticket1 = await pool.query(`INSERT INTO ticket VALUES(nextval('order_ticket_no'), '${bookRef.rows[0].book_ref}', '${passengers[i]}') RETURNING ticket_no;`);

        var ticket2 = await pool.query(`INSERT INTO ticket VALUES(nextval('order_ticket_no'), '${bookRef.rows[0].book_ref}', '${passengers[i]}') RETURNING ticket_no;`);

        await pool.query(`INSERT INTO ticket_flights VALUES (${ticket1.rows[0].ticket_no}, ${flightId1}, '${class_}', ${amount1});`);

        await pool.query(`INSERT INTO ticket_flights VALUES (${ticket2.rows[0].ticket_no}, ${flightId2}, '${class_}', ${amount2});`);

        transaction.write(`
      INSERT INTO ticket_flights 
      VALUES (
      ${ticket1.rows[0].ticket_no}, 
      ${flightId1}, 
      '${class_}', 
      ${amount1});\n`
        );
        transaction.write(`
      INSERT INTO ticket_flights 
      VALUES (
      ${ticket2.rows[0].ticket_no}, 
      ${flightId2}, 
      '${class_}', 
      ${amount2});\n`
        );
      }

      const tickets = await pool.query(`SELECT ticket_no FROM ticket WHERE book_ref = ${bookRef.rows[0].book_ref};`);
      queries.write(`
      SELECT ticket_no 
      FROM ticket 
      WHERE book_ref = ${bookRef.rows[0].book_ref};\n`
      );
      for(var i=0 ; i<tickets.rows.length; i++)
      {
        //console.log(tickets.rows[i].ticket_no);
      }
      /*
      for (i = 0; i < tickets.rows.length)
        await pool.query(`INSERT INTO ticket_flights VALUES (${tickets.rows[i].ticket_no}, ${flightID}, ${class_}, ${amount});`);*/
      const seats1 = await pool.query(`SELECT seats_available from flights_info WHERE  flight_id = ${flightId1};`)
      queries.write(`
      SELECT seats_available 
      FROM flights_info 
      WHERE  flight_id = ${flightId1};\n`
      );
      const seats2 = await pool.query(`SELECT seats_available from flights_info WHERE  flight_id = ${flightId2};`)
      queries.write(`
      SELECT seats_available 
      from flights_info 
      WHERE  flight_id = ${flightId2};\n`
      );
      //console.log("Seats1 before transaction: " + seats1.rows[0].seats_available)
      //console.log("Seats2 before transaction: " + seats2.rows[0].seats_available)
      const remain1 = await pool.query(`UPDATE flights_info SET seats_available = seats_available - ${noOfPeople}, seats_booked= seats_booked + ${noOfPeople} WHERE flight_id = ${flightId1} RETURNING seats_available;`)
      const remain2 = await pool.query(`UPDATE flights_info SET seats_available = seats_available - ${noOfPeople}, seats_booked= seats_booked + ${noOfPeople} WHERE flight_id = ${flightId2} RETURNING seats_available;`)
      //console.log("Seats remaining id1: " + remain1.rows[0].seats_available);
      //console.log("Seats remaining id2: " + remain2.rows[0].seats_available);
      transaction.write(`
      UPDATE flights_info 
      SET seats_available = seats_available - ${noOfPeople}, 
      seats_booked= seats_booked + ${noOfPeople} 
      WHERE flight_id = ${flightId1} 
      RETURNING seats_available;\n`
      );
      transaction.write(`
      UPDATE flights_info 
      SET seats_available = seats_available - ${noOfPeople}, 
      seats_booked= seats_booked + ${noOfPeople} 
      WHERE flight_id = ${flightId2} 
      RETURNING seats_available;\n`
      );

      //console.log(`INSERT INTO payment VALUES (${booking}, ${passengers[0]}, '${ccn}', '${month}', '${year}', ${totalAmount});`)
      const payment = await pool.query(`INSERT INTO payment VALUES (${booking}, ${passengers[0]},'${ccn}', '${month}', '${year}', ${totalAmount});`)
      transaction.write(`
      INSERT INTO payment
      VALUES 
      (${booking}, 
      ${passengers[0]}, 
      '${ccn}', 
      '${month}', 
      '${year}', 
      ${totalAmount});\n`
      );
      const end_transaction = await pool.query(`COMMIT TRANSACTION;`)
      transaction.write(`
      COMMIT TRANSACTION;\n`
      )
      // pool.end()
      const result = await pool.query(`SELECT * from ticket where book_ref=${booking};`)
      //console.log(`select book_ref, passenger_id, ticket_no from ticket where book_ref=${booking} group by passenger_id,ticket_no;`)
      queries.write(`
      SELECT book_ref, passenger_id, ticket_no 
      FROM ticket 
      WHERE book_ref=${booking} 
      GROUP BY passenger_id,ticket_no;\n`)
      //console.log(result.rows);
      console.log("disconnected")

      res.send(result.rows);
    } 

  } catch(err){
    console.log(err.message)
  }
})

app.post('/checkIn', async(req, res) =>{
  try{

    const {book_ref, passenger_ID, ticket_number, checkedBags} = req.body;
    var boarding_no;
    console.log("Checking in user " + passenger_ID);
    //console.log("checked bags: " + checkedBags)
    for( var i=0; i<parseInt(checkedBags); i++)
    {
      if(i===0)
      {
        console.log("connected")
        const beg_transaction = await pool.query(`BEGIN TRANSACTION;`)
        transaction.write(`
    BEGIN TRANSACATION;\n`
        )
        const check_in = await pool.query(`INSERT INTO checkin VALUES (nextval('order_baggage_claim'), nextval('order_boarding_pass'), ${book_ref}, ${ticket_number}, ${passenger_ID}, ${checkedBags}, 1) RETURNING boarding_no; `)
    transaction.write(`
    INSERT INTO checkin 
    VALUES 
    (nextval('order_baggage_claim'), 
    nextval('order_boarding_pass'), 
    ${book_ref}, 
    ${ticket_number}, 
    ${passenger_ID}, 
    ${checkedBags}, 
    1) RETURNING boarding_no;\n`)
        boarding_no= check_in.rows[0].boarding_no;
        //console.log(boarding_no)
        //console.log(`INSERT INTO checkin VALUES (nextval('order_baggage_claim'), nextval('order_boarding_pass'), ${book_ref}, ${ticket_number}, ${passenger_ID}, ${checkedBags}, 1) RETURNING boarding_no; `)
        const end_transaction = await pool.query(`COMMIT TRANSACTION;`)
        transaction.write(`
    COMMIT TRANSACTION;\n`
        )
        console.log("disconnected")
      }
      else
      {
        console.log("connected")
        const beg_transaction = await pool.query(`BEGIN TRANSACTION;`)
        transaction.write(
    `BEGIN TRANSACATION;\n`
        )
        const check_in = await pool.query(`INSERT INTO checkin VALUES (nextval('order_baggage_claim'), ${boarding_no}, ${book_ref}, ${ticket_number}, ${passenger_ID}, ${checkedBags}, 1); `)        
        //console.log(`INSERT INTO checkin VALUES (nextval('order_baggage_claim'), ${boarding_no}, ${book_ref}, ${ticket_number}, ${passenger_ID}, ${checkedBags}, 1); `)
        const end_transaction = await pool.query(`COMMIT TRANSACTION;`)
        transaction.write(`
    INSERT INTO checkin 
    VALUES 
    (nextval('order_baggage_claim'), 
    ${boarding_no}, 
    ${book_ref}, 
    ${ticket_number}, 
    ${passenger_ID}, 
    ${checkedBags}, 
    1);\n`)
        transaction.write(`
    COMMIT TRANSACTION;\n`
        )
        console.log("disconnected")
      }      

    }
    const result = await pool.query(`select boarding_no, baggage_claim, gate_no from checkin as c, ticket_flights as tf, flights_info as f  where c.boarding_no=${boarding_no} and c.ticket_no=tf.ticket_no and tf.flight_id=f.flight_id;`)
    queries.write(`
    SELECT boarding_no, baggage_claim, gate_no 
    FROM checkin as c, ticket_flights as tf, flights_info as f  
    WHERE c.boarding_no=${boarding_no} and c.ticket_no=tf.ticket_no and tf.flight_id=f.flight_id;\n`)
    //console.log(result.rows)
    res.send(result.rows);

  }catch(err){
    console.log(err.message)
  }
})

app.post('/cancel', async(req, res) => {
  try{
  
  const {book_ref_cancel} = req.body;
  console.log("connected")

  console.log("Cancelling booking " + book_ref_cancel)

  await pool.query(`BEGIN TRANSACTION;`)
  transaction.write(`BEGIN TRANSACTION;\n`)
  tickets = await pool.query(`SELECT ticket_no FROM ticket WHERE book_ref = ${book_ref_cancel};`) 

  queries.write(`
  SELECT ticket_no 
  FROM ticket 
  WHERE book_ref = ${book_ref_cancel};\n`) 

  flight_id_cancel = await pool.query(`SELECT DISTINCT tf.flight_id FROM ticket_flights AS tf, ticket AS t WHERE t.book_ref=${book_ref_cancel} AND t.ticket_no=tf.ticket_no;`)

  queries.write(`
  SELECT DISTINCT tf.flight_id 
  FROM ticket_flights AS tf, ticket AS t 
  WHERE t.book_ref=${book_ref_cancel} AND t.ticket_no=tf.ticket_no;\n`)

  var ticket_count = tickets.rowCount;
  var flight_id_count = flight_id_cancel.rowCount;

  //console.log("ticket count: "+ ticket_count+ " flight id count: "+ flight_id_count)  
  var no_of_ppl;

  if(flight_id_count===2)
  {
    no_of_ppl=(ticket_count/2)
  }
  else 
  {
    no_of_ppl=ticket_count;
  }

  for(i = 0; i < tickets.rows.length; i++)
  {
    //console.log("Ticket number " + i+1 + ": " + tickets.rows[i].ticket_no)
    await pool.query(`DELETE FROM ticket_flights WHERE ticket_no = ${tickets.rows[i].ticket_no};`)
    transaction.write(`
    DELETE FROM ticket_flights 
    WHERE ticket_no = ${tickets.rows[i].ticket_no};\n`)
  }
  await pool.query(`DELETE FROM checkin WHERE book_ref = ${book_ref_cancel};`);
  transaction.write(`
  DELETE FROM checkin 
  WHERE book_ref = ${book_ref_cancel};\n`);
  await pool.query(`DELETE FROM ticket WHERE book_ref = ${book_ref_cancel};`);
  transaction.write(`
  DELETE FROM ticket 
  WHERE book_ref = ${book_ref_cancel};\n`);
  await pool.query(`DELETE FROM payment WHERE book_ref = ${book_ref_cancel};`);
  transaction.write(`
  DELETE FROM payment 
  WHERE book_ref = ${book_ref_cancel};\n`)  
  await pool.query(`DELETE FROM booking WHERE book_ref = ${book_ref_cancel};`);
  transaction.write(`
  DELETE FROM booking 
  WHERE book_ref = ${book_ref_cancel};\n`)
  await pool.query(`UPDATE flights_info SET seats_available = seats_available + ${no_of_ppl}, seats_booked = seats_booked - ${no_of_ppl} WHERE flight_id = ${flight_id_cancel.rows[0].flight_id};`)
  transaction.write(`
  UPDATE flights_info 
  SET seats_available = seats_available + ${no_of_ppl}, seats_booked = seats_booked - ${no_of_ppl} 
  WHERE flight_id = ${flight_id_cancel.rows[0].flight_id};\n`)
  if(flight_id_count==2)
  {
    await pool.query(`UPDATE flights_info SET seats_available = seats_available + ${no_of_ppl}, seats_booked = seats_booked - ${no_of_ppl} WHERE flight_id = ${flight_id_cancel.rows[1].flight_id};`)
    transaction.write(`UPDATE flights_info SET seats_available = seats_available + ${no_of_ppl}, seats_booked = seats_booked - ${no_of_ppl} WHERE flight_id = ${flight_id_cancel.rows[1].flight_id};\n`)
  }
 
  await pool.query(`COMMIT TRANSACTION;`);
  transaction.write(`COMMIT TRANSACTION;\n`);

  success = {
    "Cancellation":[
      {"Successfully":"Cancelled successfully"}]
    }

  res.send({message:'Booking Cancelled successfully'});
  console.log("disconnected")

}catch(err){
  res.send({message: 'Cancel unsuccessfully, check your Booking ref'});  
  console.log(err.message);
  }  
})

app.listen(5000, () => {
    console.log('server is up and running')
})

