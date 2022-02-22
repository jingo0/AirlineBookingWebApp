
console.log("hello");

async function printdemo()
{
    var a = document.querySelector('#dcity')
    var departureUL= a.value
    var departure = departureUL.toLowerCase();
    for (i = 0; i < departure.length; i++)
    {
      if (departure[i] == ' ')
        departure = departure.substring(0, i) + departure.substring(i + 1, departure.length);
    }

    var b = document.querySelector('#acity')
    var arrivalUL = b.value
    var arrival = arrivalUL.toLowerCase();

    for (i = 0; i < arrival.length; i++)
    {
      if (arrival[i] == ' ')
        arrival = arrival.substring(0, i) + arrival.substring(i + 1, arrival.length);
    }

    var date_from = document.querySelector('#start_date').value;
    //console.log(date_from+"\n")
    var date_to = document.querySelector('#end_date').value;
    //console.log(date_to)
    /*var day1 = date_from.substring(8,date_from.length)
    var day2 = date_to.substring(8, date_to.length)
    var month1 = date_from.substring(5,7)
    var month2 = date_to.substring(5,7)
    var year1 = date_from.substring(0,4)
    var year2 = date_to.substring(0,4)*/
    var class_= document.querySelector('#class').value;

    var flightType = document.getElementsByName('flightType');
    var flightTypeval;
    var ischecked_method = false;
    for ( var i = 0; i < flightType.length; i++) {
        if(flightType[i].checked) {
            ischecked_method = true;
            flightTypeval=flightType[i].value;
            break;
        } 
    }
    if(!ischecked_method)   
    { //payment method button is not checked
        alert("Please choose flight type");
    }
    //console.log(flightTypeval)
    //console.log(day2)

    if (departure == "" || arrival == "")
    {
      alert("Please input a valid departure or arrival city");
      return false;
    }
    else if(date_to =='' || date_from =='')
    {
      alert("Please input a valid dates");
      return false;
    }
    else
    {
      try {
        // insert new demo to "http://localhost:5000/result", with "POST" method
        const body = { departure: departure, arrival: arrival, date_from: date_from, date_to: date_to, class_ : class_, flightTpyeval : flightTypeval};
    
        // connect to heroku, remove localhost:port
        const response = await fetch("http://localhost:5000/result", {        
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });
        
        //console.log(await response.json())
        //displaying data to webpage.
        const abc = await response.json();
        const message = document.querySelector('#search_result');
        
        // console.log(abc.direct_flights.length)
        // console.log(abc.indirect_flights.length)
        if(abc.length===0)
        {
          message.textContent = "No flights available"
        }
        else
        {
          message.textContent= '';
        }

        var cols = [];  
        for (var i = 0; i < abc.length; i++)
        {
            for (var key in abc[i]) 
            {
                
                if (cols.indexOf(key) === -1) 
                {
                    // Push all keys to the array
                    //console.log(key+"\n")
                    cols.push(key);
                }
            }
        }

        // create a table element
        var table = document.createElement("table");
             
        // create table row
        var tr = table.insertRow(-1);
         
        for (var i = 0; i < cols.length; i++)
        {
             
            // Create the table header
            var theader = document.createElement("th");
            theader.innerHTML = cols[i];
             
            // Append column name to the table row
            tr.appendChild(theader);
        }

        // Add the data to the table
        for (var i = 0; i < abc.length; i++) 
        {
                 
          // Create a new row
          var trow = table.insertRow(-1);
          for (var j = 0; j < cols.length; j++) 
          {
              var cell = trow.insertCell(-1);
                
              // Inserting the cell data
              if(abc[i][cols[j]] instanceof Object)
              {
                //console.log(abc[i][cols[j]].hours+"hr " +abc[i][cols[j]].minutes+"min\n")
                cell.innerHTML = abc[i][cols[j]].hours+"hr " +abc[i][cols[j]].minutes+"min";
              }
              else
              {
                cell.innerHTML = abc[i][cols[j]];
              }
          }
        }
       
        // Adding the created table
        var newTable = document.getElementById("table");
        newTable.innerHTML = "";
        newTable.appendChild(table);


      } catch (err) {
        console.log(err.message);
      }
    }
}

async function newUser()
{
  var firstName = document.querySelector('#firstName').value;
  var lastName = document.querySelector('#lastName').value;
  var email = document.querySelector('#email').value;
  var phoneNum = document.querySelector('#phoneNum').value;
  var password = document.querySelector('#password').value;
  const body = { firstName: firstName, lastName: lastName, email: email, phoneNum: phoneNum, password: password};

  //filestream.write(`INSERT INTO passenger \nVALUES(nextval('order_passenger_id'),'${firstName}', '${lastName}', '${email}', '${phoneNum}', '${password}');`);

  const response = await fetch("http://localhost:5000/newUser", {        
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  const userID = await response.json();
  //const userID = JSON.res;

  alert("Your passengerID is: " + userID[0].passenger_id);
}

async function getBookingData()
{
  var alerted = false;
  var flighBookedtType = document.getElementsByName('flight_Type');
  var flightBookedTypeval;
  var ischecked_book_method = false;
  for ( var i = 0; i < flighBookedtType.length; i++) {
      if(flighBookedtType[i].checked) {
          ischecked_book_method = true;
          flightBookedTypeval=flighBookedtType[i].value;
          break;
      } 
  }
  //console.log(flightBookedTypeval)
  if(!ischecked_book_method)   
  { //payment method button is not checked
      alert("Please choose flight type");
      alerted=true
  }
  var flightId1 = document.querySelector('#flightId1').value;
  var flightId2;
  if(flightBookedTypeval=="indirect")
  {
    flightId2 = document.querySelector('#flightId2').value;
  }
  var noOfPeople = document.querySelector('#numberOfPeople').value;
  var class_ = document.querySelector('#class').value;
  let passengers = []
  passengers[0] = document.querySelector('#passenger1').value;
  passengers[1] = document.querySelector('#passenger2').value;
  passengers[2] = document.querySelector('#passenger3').value;
  passengers[3] = document.querySelector('#passenger4').value;
  passengers[4] = document.querySelector('#passenger5').value;
  passengers[5] = document.querySelector('#passenger6').value;
  

  //console.log(flightId1)
  
  //check for valid inputs
  if(((flightId1 == '' && flightBookedTypeval=="direct") || (flightId2=='' && flightBookedTypeval=="indirect")) && alerted===false)
  {
    alert("Input flight ID.");
    alerted = true;
  }  
  for (i = 0; i < 6; i++)
  {
    if (passengers[i] == '' && i < noOfPeople && alerted===false)
    {
      alert(`Please provide valid passengerID for passenger ${i + 1}`  );
      alerted = true;
    } 
  }
  //creditcard validation
  let cc= document.querySelector('#ccn').value;
  var ccn = cc.split(' ').join('');
  if  ((ccn.length < 16 || ccn.length > 16) && alerted === false) 
  {
    alert("Enter valid credit card number")
    alerted = true;
  } 
  else if (ccn.length == 16 && alerted === false)
  {
    var allowedChars = "0123456789";
    var flag;
    if(!alerted)
    {
      for(var i=0; i < ccn.length; i++)
      {       
          flag = false;
          for(var j=0; j<allowedChars.length; j++)
          {
              if (ccn.charAt(i) == allowedChars.charAt(j)) 
              {
                  flag = true; 
              }
          }
          if(flag == false) 
          { 
            alert("Enter valid credit card number")
            alerted=true;
          }
      }
    }
  }
  var month = document.querySelector('#expireMM').value;
  var year = document.querySelector('#expireYY').value;
  //var expiry = `${month}/${year}`;
  // console.log(expiry)
  if(month=='' && alerted ===false)
  {
    alert("Please choose expire month")
    alerted=true;
  }
  if(year=='' && alerted === false)
  {
    alert("please choose expire year")
    alerted=true;
  }
  // var expiry_=document.querySelector('#expiry').value;
  // console.log(expiry_)
  var cvv= document.querySelector('#cvv').value;
  if(cvv=='' && alerted === false)
  {
    alert("please enter security code")
    alerted=true;
  }

  if (!/^[0-9]{3,4}$/.test(cvv) && alerted ===false)
  {
    alert("Please enter valid security code")
    alerted= true;
  }

  var card_holder = document.querySelector('#cardHolder').value;

  if(card_holder=='' && alerted===false)
  {
    alert("please enter card holder's name")
    alerted=true;
  }
  if(!alerted)
  {
    const body = {flightBookedTypeval : flightBookedTypeval, flightId1 : flightId1, flightId2 : flightId2, noOfPeople : noOfPeople, class_ : class_, passengers : passengers, 
    ccn : ccn, month : month, year : year, cvv : cvv, card_holder : card_holder}

    const response = await fetch("http://localhost:5000/booking", {        
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
      });

    const booking= await response.json(); 
    //console.log(JSON.stringify(booking.rows))
    var booking_data = document.querySelector('#booking');
    booking_data.innerHTML=''
    //print booking data
    for(var i=0; i<booking.length; i++)
    {
      booking_data.innerHTML += "<b>Ticket Number: " + booking[i].ticket_no + "  |  </b>Booking Reference: " + booking[i].book_ref + "  |  Passenger ID: " + booking[i].passenger_id + "<br/>";
    }    
  }

}

async function checkIn()
{
  var book_ref= document.querySelector('#book_ref').value;
  var passenger_ID = document.querySelector('#passenger_id').value;
  var ticket_number = document.querySelector('#ticket_no').value;
  var checkedBags = document.querySelector('#checkedBags').value;

  var checkIn_alert=false;

  if(book_ref=='')
  {
    alert("Please enter Booking reference number")
    checkIn_alert=true;
  }
  else if(passenger_ID=='' && checkIn_alert===false)
  {
    alert("Please enter Passenger ID")
    checkIn_alert=true;
  }
  else if(ticket_number=='' && checkIn_alert===false)
  {
    alert("Please enter ticket number")
    checkIn_alert=true;
  }
  else if(checkedBags=='' && checkIn_alert===false)
  {
    alert("please enter number of baggage")
    checkIn_alert=true
  }
  else if(checkedBags<1 || checkedBags>2)
  {
    alert("We only allow 1 or 2 bags for check In")
  }
  //console.log(book_ref + " " + passenger_ID + " " + ticket_number +" " + checkedBags)  

  if(!checkIn_alert)
  {
    const body = { book_ref : book_ref, passenger_ID : passenger_ID, ticket_number: ticket_number, checkedBags : checkedBags}

    const response = await fetch("http://localhost:5000/checkIn", {        
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
      });

    const checkin= await response.json(); 
    var add= document.querySelector('#checkindetails');
    //console.log(checkin.length)
    if(checkin.length==2)
    {
      //console.log("true")
      add.textContent="Your boarding number is: " + checkin[0].boarding_no + "|| Your baggage claim is: " + checkin[0].baggage_claim+","+checkin[1].baggage_claim + "|| Your gate number is: " + checkin[0].gate_no;
    }
    else
    {
      add.textContent="Your boarding number is: " + checkin[0].boarding_no + "|| Your baggage claim is: " + checkin[0].baggage_claim + "|| Your gate number is: " + checkin[0].gate_no;
    }    
    
  }  

}

async function cancel()
{
  var book_ref_cancel = document.querySelector('#book_ref_cancel').value;

  var cancel_alert=false;

  if(book_ref_cancel=='')
  {
    alert("Please enter booking reference")
    cancel_alert=true;
  }

  if(!cancel_alert)
  {
    const body = { book_ref_cancel : book_ref_cancel }

    const response = await fetch("http://localhost:5000/cancel", {        
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
      });

    const cancel = await response.json();
    //const msg = documnet.querySelector('#cancel_msg');
    console.log(cancel)
    alert(cancel.message);

  }

  
}
