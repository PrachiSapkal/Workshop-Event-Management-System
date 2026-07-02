using dotnetapp.Exceptions;
using dotnetapp.Models;
using dotnetapp.Data;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework;
using System.Linq;
using System.Reflection;
using dotnetapp.Services;
using System;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System.Net;
using System.Net.Http;
using System.Text;

namespace dotnetapp.Tests
{
    [TestFixture]
    public class Tests
    {

        private ApplicationDbContext _context;
        private HttpClient _httpClient;

        [SetUp]
        public void Setup()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>().UseInMemoryDatabase(databaseName: "TestDatabase").Options;
            _context = new ApplicationDbContext(options);

            _httpClient = new HttpClient();
            _httpClient.BaseAddress = new Uri("http://localhost:8080");

        }

        [TearDown]
        public void TearDown()
        {
            _context.Dispose();
        }

        [Test, Order(1)]
        public async Task Backend_Test_Post_Method_Register_Admin_Returns_HttpStatusCode_OK()
        {
            ClearDatabase();
            string uniqueId = Guid.NewGuid().ToString();

            // Generate a unique userName based on a timestamp
            string uniqueUsername = $"abcd_{uniqueId}";
            string uniqueEmail = $"abcd{uniqueId}@gmail.com";

            string requestBody = $"{{\"Username\": \"{uniqueUsername}\", \"Password\": \"abc@123A\", \"Email\": \"{uniqueEmail}\", \"MobileNumber\": \"1234567890\", \"UserRole\": \"Admin\"}}";
            HttpResponseMessage response = await _httpClient.PostAsync("/api/register", new StringContent(requestBody, Encoding.UTF8, "application/json"));

            Console.WriteLine(response.StatusCode);
            string responseString = await response.Content.ReadAsStringAsync();

            Console.WriteLine(responseString);
            Assert.AreEqual(HttpStatusCode.OK, response.StatusCode);
        }

        [Test, Order(2)]
        public async Task Backend_Test_Post_Method_Login_Admin_Returns_HttpStatusCode_OK()
        {
            ClearDatabase();

            string uniqueId = Guid.NewGuid().ToString();

            // Generate a unique userName based on a timestamp
            string uniqueUsername = $"abcd_{uniqueId}";
            string uniqueEmail = $"abcd{uniqueId}@gmail.com";

            string requestBody = $"{{\"Username\": \"{uniqueUsername}\", \"Password\": \"abc@123A\", \"Email\": \"{uniqueEmail}\", \"MobileNumber\": \"1234567890\", \"UserRole\": \"Admin\"}}";
            HttpResponseMessage response = await _httpClient.PostAsync("/api/register", new StringContent(requestBody, Encoding.UTF8, "application/json"));

            // Print registration response
            string registerResponseBody = await response.Content.ReadAsStringAsync();
            Console.WriteLine("Registration Response: " + registerResponseBody);

            // Login with the registered user
            string loginRequestBody = $"{{\"Email\" : \"{uniqueEmail}\",\"Password\" : \"abc@123A\"}}"; // Updated variable names
            HttpResponseMessage loginResponse = await _httpClient.PostAsync("/api/login", new StringContent(loginRequestBody, Encoding.UTF8, "application/json"));

            // Print login response
            string loginResponseBody = await loginResponse.Content.ReadAsStringAsync();
            Console.WriteLine("Login Response: " + loginResponseBody);

            Assert.AreEqual(HttpStatusCode.OK, loginResponse.StatusCode);
        }


        [Test, Order(3)]
        public async Task Backend_Test_Post_WorkshopEvent_With_Token_By_Admin_Returns_HttpStatusCode_OK()
        {
            ClearDatabase();
            string uniqueId = Guid.NewGuid().ToString();

            // Generate a unique userName based on a timestamp
            string uniqueUsername = $"abcd_{uniqueId}";
            string uniqueEmail = $"abcd{uniqueId}@gmail.com";

            string requestBody = $"{{\"Username\": \"{uniqueUsername}\", \"Password\": \"abc@123A\", \"Email\": \"{uniqueEmail}\", \"MobileNumber\": \"1234567890\", \"UserRole\": \"Admin\"}}";
            HttpResponseMessage response = await _httpClient.PostAsync("/api/register", new StringContent(requestBody, Encoding.UTF8, "application/json"));

            // Print registration response
            string registerResponseBody = await response.Content.ReadAsStringAsync();
            Console.WriteLine("Registration Response: " + registerResponseBody);

            // Login with the registered user
            string loginRequestBody = $"{{\"Email\" : \"{uniqueEmail}\",\"Password\" : \"abc@123A\"}}"; // Updated variable names
            HttpResponseMessage loginResponse = await _httpClient.PostAsync("/api/login", new StringContent(loginRequestBody, Encoding.UTF8, "application/json"));

            // Print login response
            string loginResponseBody = await loginResponse.Content.ReadAsStringAsync();
            Console.WriteLine("Login Response: " + loginResponseBody);

            Assert.AreEqual(HttpStatusCode.OK, loginResponse.StatusCode);
            string responseBody = await loginResponse.Content.ReadAsStringAsync();

            dynamic responseMap = JsonConvert.DeserializeObject(responseBody);

            string token = responseMap.token;

            Assert.IsNotNull(token);

            // Generate a unique event name
            string uniqueEventName = $"Event_{Guid.NewGuid()}";

            // Create JSON payload for WorkshopEvent
            string workshopEventJson = $"{{\"EventName\":\"{uniqueEventName}\",\"OrganizerName\":\"John Doe\",\"Category\":\"Technology\",\"Description\":\"A workshop about the latest tech trends.\",\"Location\":\"San Francisco, CA\",\"StartDateTime\":\"2025-03-12T09:00:00Z\",\"EndDateTime\":\"2025-03-12T17:00:00Z\",\"Capacity\":500}}";

            Console.WriteLine("Token: " + token);
            _httpClient.DefaultRequestHeaders.Add("Authorization", "Bearer " + token);

            HttpResponseMessage workshopEventResponse = await _httpClient.PostAsync(
                "/api/workshop-event",
                new StringContent(workshopEventJson, Encoding.UTF8, "application/json")
            );

            Console.WriteLine("Response: " + workshopEventResponse);

            Assert.AreEqual(HttpStatusCode.OK, workshopEventResponse.StatusCode);

        }

        [Test, Order(4)]
        public async Task Backend_Test_Post_WorkshopEvent_Without_Token_By_Admin_Returns_HttpStatusCode_Unauthorized()
        {
            ClearDatabase();
            string uniqueId = Guid.NewGuid().ToString();

            // Generate a unique userName based on a timestamp
            string uniqueUsername = $"abcd_{uniqueId}";
            string uniqueEmail = $"abcd{uniqueId}@gmail.com";

            string requestBody = $"{{\"Username\": \"{uniqueUsername}\", \"Password\": \"abc@123A\", \"Email\": \"{uniqueEmail}\", \"MobileNumber\": \"1234567890\", \"UserRole\": \"Admin\"}}";
            HttpResponseMessage response = await _httpClient.PostAsync("/api/register", new StringContent(requestBody, Encoding.UTF8, "application/json"));

            // Print registration response
            string registerResponseBody = await response.Content.ReadAsStringAsync();
            Console.WriteLine("Registration Response: " + registerResponseBody);

            // Login with the registered user
            string loginRequestBody = $"{{\"Email\" : \"{uniqueEmail}\",\"Password\" : \"abc@123A\"}}"; // Updated variable names
            HttpResponseMessage loginResponse = await _httpClient.PostAsync("/api/login", new StringContent(loginRequestBody, Encoding.UTF8, "application/json"));

            // Print login response
            string loginResponseBody = await loginResponse.Content.ReadAsStringAsync();
            Console.WriteLine("Login Response: " + loginResponseBody);

            Assert.AreEqual(HttpStatusCode.OK, loginResponse.StatusCode);

            // Generate a unique event name
            string uniqueEventName = $"Event_{Guid.NewGuid()}";

            // Create JSON payload for WorkshopEvent
            string workshopEventJson = $"{{\"EventName\":\"{uniqueEventName}\",\"OrganizerName\":\"John Doe\",\"Category\":\"Technology\",\"Description\":\"A workshop about the latest tech trends.\",\"Location\":\"San Francisco, CA\",\"StartDateTime\":\"2025-03-12T09:00:00Z\",\"EndDateTime\":\"2025-03-12T17:00:00Z\",\"Capacity\":500}}";

            HttpResponseMessage workshopEventResponse = await _httpClient.PostAsync(
                "/api/workshop-event",
                new StringContent(workshopEventJson, Encoding.UTF8, "application/json")
            );

            Console.WriteLine("Response: " + workshopEventResponse);

            Assert.AreEqual(HttpStatusCode.Unauthorized, workshopEventResponse.StatusCode);

        }

        [Test, Order(5)]
        public async Task Backend_Test_Get_Method_Get_WorkshopEventById_In_WorkshopEvent_Service_Fetches_WorkshopEvent_Successfully()
        {
            ClearDatabase();

            var workshopEventData = new Dictionary<string, object>
    {
        { "WorkshopEventId", 10 }, // Unique identifier for the workshop event
        { "EventName", "Tech Innovations Summit 2025" }, // Name of the event
        { "OrganizerName", "TechFuture Corp." }, // Organizer of the event
        { "Category", "Technology" }, // Event category
        { "Description", "A summit to discuss upcoming trends in AI, blockchain, and cloud computing." }, // Description of the event
        { "Location", "New York, USA" }, // Location of the event
        { "StartDateTime", new DateTime(2025, 5, 15, 9, 0, 0) }, // Start date and time
        { "EndDateTime", new DateTime(2025, 5, 15, 18, 0, 0) }, // End date and time
        { "Capacity", 500 } // Maximum capacity of attendees
    };

            var workshopEvent = new WorkshopEvent();
            foreach (var kvp in workshopEventData)
            {
                var propertyInfo = typeof(WorkshopEvent).GetProperty(kvp.Key);
                if (propertyInfo != null)
                {
                    propertyInfo.SetValue(workshopEvent, kvp.Value);
                }
            }
            _context.WorkshopEvents.Add(workshopEvent);
            _context.SaveChanges();

            string assemblyName = "dotnetapp";
            Assembly assembly = Assembly.Load(assemblyName);
            string serviceName = "dotnetapp.Services.WorkshopEventService";
            string typeName = "dotnetapp.Models.WorkshopEvent";

            Type serviceType = assembly.GetType(serviceName);
            Type modelType = assembly.GetType(typeName);

            MethodInfo getWorkshopEventMethod = serviceType.GetMethod("GetWorkshopEventById");

            if (getWorkshopEventMethod != null)
            {
                var service = Activator.CreateInstance(serviceType, _context);
                var retrievedWorkshopEvent = (Task<WorkshopEvent>)getWorkshopEventMethod.Invoke(service, new object[] { 10 });

                Assert.IsNotNull(retrievedWorkshopEvent);
                Assert.AreEqual(workshopEvent.EventName, retrievedWorkshopEvent.Result.EventName);
            }
            else
            {
                Assert.Fail();
            }
        }

        [Test, Order(6)]
        public async Task Backend_Test_Put_Method_UpdateWorkshopEvent_In_WorkshopEvent_Service_Updates_WorkshopEvent_Successfully()
        {
            ClearDatabase();

            var workshopEventData = new Dictionary<string, object>
    {
        { "WorkshopEventId", 10 }, // Unique identifier for the workshop event
        { "EventName", "Tech Innovations Summit 2025" }, // Name of the event
        { "OrganizerName", "TechFuture Corp." }, // Organizer of the event
        { "Category", "Technology" }, // Event category
        { "Description", "A summit to discuss upcoming trends in AI, blockchain, and cloud computing." }, // Description of the event
        { "Location", "New York, USA" }, // Location of the event
        { "StartDateTime", new DateTime(2025, 5, 15, 9, 0, 0) }, // Start date and time
        { "EndDateTime", new DateTime(2025, 5, 15, 18, 0, 0) }, // End date and time
        { "Capacity", 500 } // Maximum capacity of attendees
    };

            var workshopEvent = new WorkshopEvent();
            foreach (var kvp in workshopEventData)
            {
                var propertyInfo = typeof(WorkshopEvent).GetProperty(kvp.Key);
                if (propertyInfo != null)
                {
                    propertyInfo.SetValue(workshopEvent, kvp.Value);
                }
            }
            _context.WorkshopEvents.Add(workshopEvent);
            _context.SaveChanges();

            string assemblyName = "dotnetapp";
            Assembly assembly = Assembly.Load(assemblyName);
            string serviceName = "dotnetapp.Services.WorkshopEventService";
            string typeName = "dotnetapp.Models.WorkshopEvent";

            Type serviceType = assembly.GetType(serviceName);
            Type modelType = assembly.GetType(typeName);

            MethodInfo updateMethod = serviceType.GetMethod("UpdateWorkshopEvent", new[] { typeof(int), modelType });

            if (updateMethod != null)
            {
                var service = Activator.CreateInstance(serviceType, _context);

                // Updated workshop event data
                var updatedWorkshopEventData = new Dictionary<string, object>
        {
            { "WorkshopEventId", 10 }, // Unique identifier for the workshop event
            { "EventName", "Global AI Workshop 2025" }, // Updated event name
            { "OrganizerName", "AI World Leaders" }, // Updated organizer
            { "Category", "Artificial Intelligence" }, // Updated category
            { "Description", "A workshop focused on the latest AI advancements and trends." }, // Updated description
            { "Location", "San Francisco, USA" }, // Updated location
            { "StartDateTime", new DateTime(2025, 6, 20, 10, 0, 0) }, // Updated start date and time
            { "EndDateTime", new DateTime(2025, 6, 20, 19, 0, 0) }, // Updated end date and time
            { "Capacity", 700 } // Updated capacity
        };

                var updatedWorkshopEvent = Activator.CreateInstance(modelType);
                foreach (var kvp in updatedWorkshopEventData)
                {
                    var propertyInfo = modelType.GetProperty(kvp.Key);
                    if (propertyInfo != null)
                    {
                        propertyInfo.SetValue(updatedWorkshopEvent, kvp.Value);
                    }
                }

                var updateResult = (Task<bool>)updateMethod.Invoke(service, new object[] { 10, updatedWorkshopEvent });

                var updatedWorkshopEventFromDb = await _context.WorkshopEvents.FindAsync(10);
                Assert.IsNotNull(updatedWorkshopEventFromDb);
                Assert.AreEqual("Global AI Workshop 2025", updatedWorkshopEventFromDb.EventName);
            }
            else
            {
                Assert.Fail();
            }
        }


        [Test, Order(7)]
        public async Task Backend_Test_Delete_Method_DeleteWorkshopEvent_In_WorkshopEvent_Service_Deletes_WorkshopEvent_Successfully()
        {
            ClearDatabase();

            // Add WorkshopEvent
            var workshopEventData = new Dictionary<string, object>
    {
        { "WorkshopEventId", 4 }, // Unique identifier for the workshop event
        { "EventName", "Tech Innovations 2025" }, // Name of the workshop event
        { "OrganizerName", "AI World Leaders" }, // Updated organizer,
        { "Category", "Technology & Innovation" }, // Event category
        { "Description", "A premier tech workshop showcasing cutting-edge innovations." }, // Description of the event
        { "Location", "San Francisco, CA" }, // Event location
        { "StartDateTime", new DateTime(2025, 6, 20, 10, 0, 0) }, // Updated start date and time
        { "EndDateTime", new DateTime(2025, 6, 20, 19, 0, 0) }, // Updated end date and time     
        {"Capacity", 200}
    };

            var workshopEvent = new WorkshopEvent();
            foreach (var kvp in workshopEventData)
            {
                var propertyInfo = typeof(WorkshopEvent).GetProperty(kvp.Key);
                if (propertyInfo != null)
                {
                    propertyInfo.SetValue(workshopEvent, kvp.Value);
                }
            }

            _context.WorkshopEvents.Add(workshopEvent);
            _context.SaveChanges();

            string assemblyName = "dotnetapp";
            Assembly assembly = Assembly.Load(assemblyName);
            string serviceName = "dotnetapp.Services.WorkshopEventService";
            string typeName = "dotnetapp.Models.WorkshopEvent";

            Type serviceType = assembly.GetType(serviceName);
            Type modelType = assembly.GetType(typeName);

            MethodInfo deleteMethod = serviceType.GetMethod("DeleteWorkshopEvent", new[] { typeof(int) });

            if (deleteMethod != null)
            {
                var service = Activator.CreateInstance(serviceType, _context);
                var deleteResult = (Task<bool>)deleteMethod.Invoke(service, new object[] { 4 });

                var deletedWorkshopEventFromDb = await _context.WorkshopEvents.FindAsync(4);
                Assert.IsNull(deletedWorkshopEventFromDb);
            }
            else
            {
                Assert.Fail();
            }
        }

        [Test, Order(8)]
        public async Task Backend_Test_Post_Method_AddBooking_In_Booking_Service_Posts_Successfully()
        {
            ClearDatabase();

            // Add User
            var user = new User
            {
                UserId = 500,
                Username = "testuser",
                Password = "testpassword",
                Email = "test@example.com",
                MobileNumber = "1234567890",
                UserRole = "User"
            };
            _context.Users.Add(user);
            _context.SaveChanges();

            // Add WorkshopEvent
            var workshopEvent = new WorkshopEvent
            {
                WorkshopEventId = 600,
                EventName = "Tech Workshop 2025",
                OrganizerName = "Dr. John Doe",
                Category = "Technology",
                Description = "A global event for tech enthusiasts.",
                Location = "New York",
                StartDateTime = new DateTime(2025, 6, 20), // Updated start date and time
                EndDateTime = new DateTime(2025, 6, 20), // Updated end date and time
                Capacity = 100
            };
            _context.WorkshopEvents.Add(workshopEvent);
            _context.SaveChanges();

            // Add Booking
            string assemblyName = "dotnetapp";
            Assembly assembly = Assembly.Load(assemblyName);
            string serviceName = "dotnetapp.Services.BookingService";
            string typeName = "dotnetapp.Models.Booking";

            Type serviceType = assembly.GetType(serviceName);
            Type modelType = assembly.GetType(typeName);

            MethodInfo method = serviceType.GetMethod("AddBooking", new[] { modelType });

            if (method != null)
            {
                var bookingData = new Dictionary<string, object>
        {
            { "BookingId", 700 },
            { "UserId", 500 },
            { "WorkshopEventId", 600 },
            { "BookingStatus", "Confirmed" },
            { "BookingDate", DateTime.Now },
            { "AdditionalNotes", "Looking forward to the event!" },
            { "Proof", "confirmation_123.pdf" },
            { "Gender", "Male" },
            { "Age", 30 },
            { "Occupation", "Software Engineer" },
            { "City", "New York" }
        };

                var booking = Activator.CreateInstance(modelType);
                foreach (var kvp in bookingData)
                {
                    var propertyInfo = modelType.GetProperty(kvp.Key);
                    if (propertyInfo != null)
                    {
                        propertyInfo.SetValue(booking, kvp.Value);
                    }
                }

                var service = Activator.CreateInstance(serviceType, _context);
                var result = (Task<bool>)method.Invoke(service, new object[] { booking });

                var addedBooking = await _context.Bookings.FindAsync(700);
                Assert.IsNotNull(addedBooking);
                Assert.AreEqual("confirmation_123.pdf", addedBooking.Proof);
            }
            else
            {
                Assert.Fail();
            }
        }


        [Test, Order(9)]
        public async Task Backend_Test_Get_Method_GetBookingByUserId_In_Booking_Service_Fetches_Successfully()
        {
            // Clear database
            ClearDatabase();

            // Add User
            var userData = new Dictionary<string, object>
    {
        { "UserId", 500 },
        { "Username", "testuser" },
        { "Password", "testpassword" },
        { "Email", "test@example.com" },
        { "MobileNumber", "1234567890" },
        { "UserRole", "User" }
    };

            var user = new User();
            foreach (var kvp in userData)
            {
                var propertyInfo = typeof(User).GetProperty(kvp.Key);
                if (propertyInfo != null)
                {
                    propertyInfo.SetValue(user, kvp.Value);
                }
            }
            _context.Users.Add(user);
            _context.SaveChanges();

            // Add WorkshopEvent
            var workshopEventData = new Dictionary<string, object>
    {
        { "WorkshopEventId", 600 },
        { "EventName", "Tech Workshop 2025" },
        { "OrganizerName", "Dr. John Doe" },
        { "Category", "Technology" },
        { "Description", "A global event for tech enthusiasts." },
        { "Location", "New York" },
        { "StartDateTime", new DateTime(2025, 6, 20) },
        { "EndDateTime", new DateTime(2025, 6, 20) },
        { "Capacity", 100 }
    };

            var workshopEvent = new WorkshopEvent();
            foreach (var kvp in workshopEventData)
            {
                var propertyInfo = typeof(WorkshopEvent).GetProperty(kvp.Key);
                if (propertyInfo != null)
                {
                    propertyInfo.SetValue(workshopEvent, kvp.Value);
                }
            }
            _context.WorkshopEvents.Add(workshopEvent);
            _context.SaveChanges();

            // Add Booking
            var bookingData = new Dictionary<string, object>
    {
        { "BookingId", 700 },
        { "UserId", 500 },
        { "WorkshopEventId", 600 },
        { "BookingStatus", "Confirmed" },
        { "BookingDate", DateTime.Now },
        { "AdditionalNotes", "Looking forward to the event!" },
        { "Proof", "confirmation_123.pdf" },
        { "Gender", "Male" },
        { "Age", 30 },
        { "Occupation", "Software Engineer" },
        { "City", "New York" }
    };

            var booking = new Booking();
            foreach (var kvp in bookingData)
            {
                var propertyInfo = typeof(Booking).GetProperty(kvp.Key);
                if (propertyInfo != null)
                {
                    propertyInfo.SetValue(booking, kvp.Value);
                }
            }
            _context.Bookings.Add(booking);
            _context.SaveChanges();

            // Fetch Booking by UserId
            string assemblyName = "dotnetapp";
            Assembly assembly = Assembly.Load(assemblyName);
            string serviceName = "dotnetapp.Services.BookingService";
            string typeName = "dotnetapp.Models.Booking";

            Type serviceType = assembly.GetType(serviceName);
            Type modelType = assembly.GetType(typeName);

            MethodInfo method = serviceType.GetMethod("GetBookingsByUserId");

            if (method != null)
            {
                var service = Activator.CreateInstance(serviceType, _context);
                var result = (Task<IEnumerable<Booking>>)method.Invoke(service, new object[] { 500 });
                Assert.IsNotNull(result);

                bool check = true;
                foreach (var item in result.Result)
                {
                    Assert.AreEqual("confirmation_123.pdf", item.Proof);
                    check = false;
                }

                if (check)
                {
                    Assert.Fail();
                }
            }
            else
            {
                Assert.Fail();
            }
        }


        [Test, Order(10)]
        public async Task Backend_Test_Put_Method_Update_In_Booking_Service_Updates_Successfully()
        {
            ClearDatabase();

            var userData = new Dictionary<string, object>
    {
        { "UserId", 500 },
        { "Username", "bookinguser" },
        { "Password", "securepassword" },
        { "Email", "booking@example.com" },
        { "MobileNumber", "9876543210" },
        { "UserRole", "User" }
    };

            var user = new User();
            foreach (var kvp in userData)
            {
                var propertyInfo = typeof(User).GetProperty(kvp.Key);
                if (propertyInfo != null)
                {
                    propertyInfo.SetValue(user, kvp.Value);
                }
            }
            _context.Users.Add(user);
            _context.SaveChanges();

            var workshopEventData = new Dictionary<string, object>
    {
        { "WorkshopEventId", 300 },
        { "EventName", "Tech Workshop 2025" },
        { "Description", "A workshop discussing future technologies and innovations." },
        { "Location", "New York" },
        { "OrganizerName", "Dr. John Doe" },
        { "Category", "Technology" },
        { "StartDateTime", new DateTime(2025, 6, 20) },
        { "EndDateTime", new DateTime(2025, 6, 20) },
        { "Capacity", 100 }
    };

            var workshopEvent = new WorkshopEvent();
            foreach (var kvp in workshopEventData)
            {
                var propertyInfo = typeof(WorkshopEvent).GetProperty(kvp.Key);
                if (propertyInfo != null)
                {
                    propertyInfo.SetValue(workshopEvent, kvp.Value);
                }
            }
            _context.WorkshopEvents.Add(workshopEvent);
            _context.SaveChanges();

            var bookingData = new Dictionary<string, object>
    {
        { "BookingId", 700 },
        { "UserId", 500 },
        { "WorkshopEventId", 300 },
        { "BookingStatus", "Pending" },
        { "BookingDate", DateTime.Now },
        { "AdditionalNotes", "Need vegetarian food." },
        { "Proof", "confirmation123.pdf" },
        { "Gender", "Male" },
        { "Age", 30 },
        { "Occupation", "Software Engineer" },
        { "City", "San Francisco" }
    };

            var booking = new Booking();
            foreach (var kvp in bookingData)
            {
                var propertyInfo = typeof(Booking).GetProperty(kvp.Key);
                if (propertyInfo != null)
                {
                    propertyInfo.SetValue(booking, kvp.Value);
                }
            }
            _context.Bookings.Add(booking);
            _context.SaveChanges();

            string assemblyName = "dotnetapp";
            Assembly assembly = Assembly.Load(assemblyName);
            string serviceName = "dotnetapp.Services.BookingService";
            string typeName = "dotnetapp.Models.Booking";

            Type serviceType = assembly.GetType(serviceName);
            Type modelType = assembly.GetType(typeName);

            MethodInfo method = serviceType.GetMethod("UpdateBooking", new[] { typeof(int), modelType });

            if (method != null)
            {
                var updatedBookingData = new Dictionary<string, object>
        {
            { "UserId", 500 },
            { "WorkshopEventId", 300 },
            { "BookingStatus", "Confirmed" },
            { "BookingDate", DateTime.Now },
            { "AdditionalNotes", "Need vegetarian food." },
            { "Proof", "confirmation123.pdf" },
            { "Gender", "Male" },
            { "Age", 30 },
            { "Occupation", "Software Engineer" },
            { "City", "San Francisco" }
        };

                var updatedBooking = new Booking();
                foreach (var kvp in updatedBookingData)
                {
                    var propertyInfo = typeof(Booking).GetProperty(kvp.Key);
                    if (propertyInfo != null)
                    {
                        propertyInfo.SetValue(updatedBooking, kvp.Value);
                    }
                }

                var service = Activator.CreateInstance(serviceType, _context);
                var updateResult = (Task<bool>)method.Invoke(service, new object[] { 700, updatedBooking });
                var updatedBookingFromDb = await _context.Bookings.FindAsync(700);

                Assert.IsNotNull(updatedBookingFromDb);
                Assert.AreEqual("Confirmed", updatedBookingFromDb.BookingStatus);
            }
            else
            {
                Assert.Fail();
            }
        }

        [Test, Order(11)]
        public async Task Backend_Test_Delete_Method_DeleteBooking_Service_Deletes_Booking_Successfully()
        {
            ClearDatabase();

            var userData = new Dictionary<string, object>
    {
        { "UserId", 500 },
        { "Username", "bookinguser" },
        { "Password", "securepassword" },
        { "Email", "booking@example.com" },
        { "MobileNumber", "9876543210" },
        { "UserRole", "User" }
    };

            var user = new User();
            foreach (var kvp in userData)
            {
                var propertyInfo = typeof(User).GetProperty(kvp.Key);
                if (propertyInfo != null)
                {
                    propertyInfo.SetValue(user, kvp.Value);
                }
            }
            _context.Users.Add(user);
            _context.SaveChanges();

            var workshopEventData = new Dictionary<string, object>
    {
        { "WorkshopEventId", 300 },
        { "EventName", "Tech Workshop 2025" },
        { "Description", "A global event for tech enthusiasts." },
        { "Location", "New York" },
        { "OrganizerName", "Dr. John Doe" },
        { "Category", "Technology" },
        { "StartDateTime", new DateTime(2025, 6, 20) },
        { "EndDateTime", new DateTime(2025, 6, 20) },
        { "Capacity", 100 }
    };

            var workshopEvent = new WorkshopEvent();
            foreach (var kvp in workshopEventData)
            {
                var propertyInfo = typeof(WorkshopEvent).GetProperty(kvp.Key);
                if (propertyInfo != null)
                {
                    propertyInfo.SetValue(workshopEvent, kvp.Value);
                }
            }
            _context.WorkshopEvents.Add(workshopEvent);
            _context.SaveChanges();

            var bookingData = new Dictionary<string, object>
    {
        { "BookingId", 700 },
        { "UserId", 500 },
        { "WorkshopEventId", 300 },
        { "BookingStatus", "Confirmed" },
        { "BookingDate", DateTime.Now },
        { "AdditionalNotes", "Need vegetarian food." },
        { "Proof", "confirmation123.pdf" },
        { "Gender", "Male" },
        { "Age", 30 },
        { "Occupation", "Software Engineer" },
        { "City", "San Francisco" }
    };

            var booking = new Booking();
            foreach (var kvp in bookingData)
            {
                var propertyInfo = typeof(Booking).GetProperty(kvp.Key);
                if (propertyInfo != null)
                {
                    propertyInfo.SetValue(booking, kvp.Value);
                }
            }
            _context.Bookings.Add(booking);
            _context.SaveChanges();

            string assemblyName = "dotnetapp";
            Assembly assembly = Assembly.Load(assemblyName);
            string serviceName = "dotnetapp.Services.BookingService";

            Type serviceType = assembly.GetType(serviceName);
            MethodInfo deleteMethod = serviceType.GetMethod("DeleteBooking", new[] { typeof(int) });

            if (deleteMethod != null)
            {
                var service = Activator.CreateInstance(serviceType, _context);
                var deleteResult = (Task<bool>)deleteMethod.Invoke(service, new object[] { 700 });

                var deletedBookingFromDb = await _context.Bookings.FindAsync(700);
                Assert.IsNull(deletedBookingFromDb);
            }
            else
            {
                Assert.Fail();
            }

            ClearDatabase();
        }



        [Test, Order(12)]
        public async Task Backend_Test_Post_Method_AddFeedback_In_Feedback_Service_Posts_Successfully()
        {
            ClearDatabase();

            // Add user
            var userData = new Dictionary<string, object>
            {
                { "UserId",42 },
                { "Username", "testuser" },
                { "Password", "testpassword" },
                { "Email", "test@example.com" },
                { "MobileNumber", "1234567890" },
                { "UserRole", "User" }
            };

            var user = new User();
            foreach (var kvp in userData)
            {
                var propertyInfo = typeof(User).GetProperty(kvp.Key);
                if (propertyInfo != null)
                {
                    propertyInfo.SetValue(user, kvp.Value);
                }
            }
            _context.Users.Add(user);
            _context.SaveChanges();

            string assemblyName = "dotnetapp";
            Assembly assembly = Assembly.Load(assemblyName);
            string ServiceName = "dotnetapp.Services.FeedbackService";
            string typeName = "dotnetapp.Models.Feedback";

            Type serviceType = assembly.GetType(ServiceName);
            Type modelType = assembly.GetType(typeName);

            MethodInfo method = serviceType.GetMethod("AddFeedback", new[] { modelType });

            if (method != null)
            {
                var feedbackData = new Dictionary<string, object>
                    {
                        { "FeedbackId", 11 },
                        { "UserId", 42 },
                        { "FeedbackText", "Great experience!" },
                        { "Date", DateTime.Now }
                    };
                var feedback = new Feedback();
                foreach (var kvp in feedbackData)
                {
                    var propertyInfo = typeof(Feedback).GetProperty(kvp.Key);
                    if (propertyInfo != null)
                    {
                        propertyInfo.SetValue(feedback, kvp.Value);
                    }
                }
                var service = Activator.CreateInstance(serviceType, _context);
                var result = (Task<bool>)method.Invoke(service, new object[] { feedback });

                var addedFeedback = await _context.Feedbacks.FindAsync(11);
                Assert.IsNotNull(addedFeedback);
                Assert.AreEqual("Great experience!", addedFeedback.FeedbackText);

            }
            else
            {
                Assert.Fail();
            }
        }

        [Test, Order(13)]
        public async Task Backend_Test_Delete_Method_Feedback_In_Feeback_Service_Deletes_Successfully()
        {
            // Add user
            ClearDatabase();

            var userData = new Dictionary<string, object>
            {
                { "UserId",42 },
                { "Username", "testuser" },
                { "Password", "testpassword" },
                { "Email", "test@example.com" },
                { "MobileNumber", "1234567890" },
                { "UserRole", "User" }
            };

            var user = new User();
            foreach (var kvp in userData)
            {
                var propertyInfo = typeof(User).GetProperty(kvp.Key);
                if (propertyInfo != null)
                {
                    propertyInfo.SetValue(user, kvp.Value);
                }
            }
            _context.Users.Add(user);
            _context.SaveChanges();

            var feedbackData = new Dictionary<string, object>
                    {
                        { "FeedbackId", 11 },
                        { "UserId", 42 },
                        { "FeedbackText", "Great experience!" },
                        { "Date", DateTime.Now }
                    };
            var feedback = new Feedback();
            foreach (var kvp in feedbackData)
            {
                var propertyInfo = typeof(Feedback).GetProperty(kvp.Key);
                if (propertyInfo != null)
                {
                    propertyInfo.SetValue(feedback, kvp.Value);
                }
            }
            _context.Feedbacks.Add(feedback);
            _context.SaveChanges();
            // Add mentorshipProgram application
            string assemblyName = "dotnetapp";
            Assembly assembly = Assembly.Load(assemblyName);
            string ServiceName = "dotnetapp.Services.FeedbackService";
            string typeName = "dotnetapp.Models.Feedback";

            Type serviceType = assembly.GetType(ServiceName);
            Type modelType = assembly.GetType(typeName);


            MethodInfo deletemethod = serviceType.GetMethod("DeleteFeedback", new[] { typeof(int) });

            if (deletemethod != null)
            {
                var service = Activator.CreateInstance(serviceType, _context);
                var deleteResult = (Task<bool>)deletemethod.Invoke(service, new object[] { 11 });

                var deletedFeedbackFromDb = await _context.Feedbacks.FindAsync(11);
                Assert.IsNull(deletedFeedbackFromDb);
            }
            else
            {
                Assert.Fail();
            }
        }

        [Test, Order(14)]
        public async Task Backend_Test_Get_Method_GetFeedbacksByUserId_In_Feedback_Service_Fetches_Successfully()
        {
            ClearDatabase();

            // Add user
            var userData = new Dictionary<string, object>
            {
                { "UserId", 330 },
                { "Username", "testuser" },
                { "Password", "testpassword" },
                { "Email", "test@example.com" },
                { "MobileNumber", "1234567890" },
                { "UserRole", "User" }
            };

            var user = new User();
            foreach (var kvp in userData)
            {
                var propertyInfo = typeof(User).GetProperty(kvp.Key);
                if (propertyInfo != null)
                {
                    propertyInfo.SetValue(user, kvp.Value);
                }
            }
            _context.Users.Add(user);
            _context.SaveChanges();

            var feedbackData = new Dictionary<string, object>
            {
                { "FeedbackId", 13 },
                { "UserId", 330 },
                { "FeedbackText", "Great experience!" },
                { "Date", DateTime.Now }
            };

            var feedback = new Feedback();
            foreach (var kvp in feedbackData)
            {
                var propertyInfo = typeof(Feedback).GetProperty(kvp.Key);
                if (propertyInfo != null)
                {
                    propertyInfo.SetValue(feedback, kvp.Value);
                }
            }
            _context.Feedbacks.Add(feedback);
            _context.SaveChanges();

            // Add mentorshipProgram application
            string assemblyName = "dotnetapp";
            Assembly assembly = Assembly.Load(assemblyName);
            string ServiceName = "dotnetapp.Services.FeedbackService";
            string typeName = "dotnetapp.Models.Feedback";

            Type serviceType = assembly.GetType(ServiceName);
            Type modelType = assembly.GetType(typeName);

            MethodInfo method = serviceType.GetMethod("GetFeedbacksByUserId");

            if (method != null)
            {
                var service = Activator.CreateInstance(serviceType, _context);
                var result = (Task<IEnumerable<Feedback>>)method.Invoke(service, new object[] { 330 });
                Assert.IsNotNull(result);
                var check = true;
                foreach (var item in result.Result)
                {
                    check = false;
                    Assert.AreEqual("Great experience!", item.FeedbackText);

                }
                if (check == true)
                {
                    Assert.Fail();

                }
            }
            else
            {
                Assert.Fail();
            }
        }

        [Test, Order(16)]
        public async Task Backend_Test_Post_Method_AddWorkshopEvent_In_WorkshopEventService_Occurs_WorkshopEventException_For_Duplicate_EventName()
        {
            ClearDatabase();

            string assemblyName = "dotnetapp";
            Assembly assembly = Assembly.Load(assemblyName);
            string serviceName = "dotnetapp.Services.WorkshopEventService";
            string typeName = "dotnetapp.Models.WorkshopEvent";

            Type serviceType = assembly.GetType(serviceName);
            Type modelType = assembly.GetType(typeName);

            MethodInfo method = serviceType.GetMethod("AddWorkshopEvent", new[] { modelType });

            if (method != null)
            {
                var workshopEventData = new Dictionary<string, object>
        {
            { "WorkshopEventId", 101 },
            { "EventName", "AI Innovations Summit" },
            { "Description", "A summit showcasing the latest trends in AI technology." },
            { "Location", "San Francisco" },
            { "OrganizerName", "Dr. John Doe" },
            { "Category", "Technology" },
            { "StartDateTime", new DateTime(2025, 6, 20) },
            { "EndDateTime", new DateTime(2025, 6, 20) },
            { "Capacity", 100 }
        };

                var workshopEvent = Activator.CreateInstance(modelType);
                foreach (var kvp in workshopEventData)
                {
                    var propertyInfo = modelType.GetProperty(kvp.Key);
                    if (propertyInfo != null)
                    {
                        propertyInfo.SetValue(workshopEvent, kvp.Value);
                    }
                }

                var service = Activator.CreateInstance(serviceType, _context);
                var result = (Task<bool>)method.Invoke(service, new object[] { workshopEvent });
                var addedWorkshopEvent = await _context.WorkshopEvents.FindAsync(101);
                Assert.IsNotNull(addedWorkshopEvent);

                var duplicateWorkshopEventData = new Dictionary<string, object>
        {
            { "WorkshopEventId", 102 },
            { "EventName", "AI Innovations Summit" },
            { "Description", "A summit showcasing the latest trends in AI technology." },
            { "Location", "New York" },
            { "OrganizerName", "Dr. John Doe" },
            { "Category", "Technology" },
            { "StartDateTime", new DateTime(2025, 6, 20) },
            { "EndDateTime", new DateTime(2025, 6, 20) },
            { "Capacity", 100 }        
        };

                var duplicateWorkshopEvent = Activator.CreateInstance(modelType);
                foreach (var kvp in duplicateWorkshopEventData)
                {
                    var propertyInfo = modelType.GetProperty(kvp.Key);
                    if (propertyInfo != null)
                    {
                        propertyInfo.SetValue(duplicateWorkshopEvent, kvp.Value);
                    }
                }

                try
                {
                    var result1 = (Task<bool>)method.Invoke(service, new object[] { duplicateWorkshopEvent });
                    Console.WriteLine("res" + result1.Result);
                    Assert.Fail();
                }
                catch (Exception ex)
                {
                    Assert.IsNotNull(ex.InnerException);
                    Assert.IsTrue(ex.InnerException is WorkshopEventException);
                    Assert.AreEqual("Event with the same name already exists", ex.InnerException.Message);
                }
            }
            else
            {
                Assert.Fail();
            }
        }

        private void ClearDatabase()
        {
            _context.Database.EnsureDeleted();
            _context.Database.EnsureCreated();
        }

    }
}