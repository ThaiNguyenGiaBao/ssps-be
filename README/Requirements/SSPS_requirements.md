# Usecase Diagram
![Usecase Diagram](./UsecaseDiagram.png)

# User Stories

### Students:
- **As a student**, I want a reliable and user-friendly service that is accessible from anywhere and supports different file types, so that it is convenient for me to use.
- **As a student**, I want a record of my previous printing activities, so that I can manage my printing profile.
- **As a student**, I want to choose the printer I want to use and adjust the print settings, so that the printing process is flexible.
- **As a student**, I want to buy more pages when needed, and ensure that the balance is not negative, so that there will always be available pages.
- **As a student**, I want my personal information and printing history protected from possible leakage, so that my data is safe.

### Student Printing Service Officer (SPSO):
- **As an SPSO**, I want to add, enable, disable, or manage details of the printers in the service, so that the management of printers is efficient.
- **As an SPSO**, I want control over the permitted file types and the default settings, so that I can modify them if necessary.
- **As an SPSO**, I want logs and regular reports regarding the printing activities of the users, so that I can monitor and analyze the usage of the system.

### IT and Support Staff:
- **As IT & Support Staff**, I want the system to run smoothly with minimal technical issues, so that there are fewer problems to deal with.
- **As IT & Support Staff**, I want to have the tools and procedures needed for troubleshooting, so that I can offer technical support to both students and SPSO.
- **As IT & Support Staff**, I want to have the tools and procedures for maintenance, so that I can keep the system running and address issues.

### Payment System Providers (BKPay):
- **As BKPay**, I want my service to be integrated seamlessly in the HCMUT_SSPS, so that I can process the purchase of additional pages reliably and securely.


# Functional Requirements
### Students:
- The system must allow students to be authenticated by students’ accounts via the HCMUT_SSO authentication service before using the system.
- The system shall allow a student to upload a document file onto the system in permitted file types (e.g., PDF, DOCX, etc.) for printing.
- The system must enable a student to select one printer from the available list.
- The system shall allow a student to specify the printing properties, such as paper size, pages (of the file) to be printed, single-/double-sided, and number of copies.
- The system must check and ensure the number of pages which a student prints does not exceed their page balance.
- The system shall adjust the students’ page balance after a successful print.
- The system has to enable students to view their printing history log in a selected period, including printer ID, file name, printing start and end time, and the number of pages for each page size.
- The students can check their account page balance.
- Students are allowed to buy additional A4-size pages using the "Buy Printing Pages" feature of the system and pay through the BKPay system of the university.

### Student Printing Service Officer (SPSO):
- The system must allow the SPSOs to be authenticated by admin accounts via the HCMUT_SSO authentication service before using the system.
- The SPSOs can configure the permitted file types.
- The system allows the SPSOs to view the printing history (log) of all students or a specific student in a selected period (from a start date to an end date) across all or specific printers.
- The SPSOs must be able to add, remove, enable, or disable printers.
- The SPSOs can change the default number of pages and the dates the system allocates the default number of pages to all students.
- The system must allow the SPSOs to see the list of existing printers and their status.
- The system shall generate reports on system usage for the SPSOs, either when requested or automatically at the end of each week.

# Non-Functional Requirements

### Usability:
- The system should have a user-friendly interface and be easy to use for beginners. More than 80% of students should be able to use the printing and deposit features within the first 15 minutes of use.
- All features are directly accessible from the navigation bar on the main webpage.
- Before printing, the system must verify the print by displaying a preview, including the number of pages, paper size, number of prints, and content of each printed page.
- The SPSO’s interface must be easy to use, with SPSOs able to get familiar with the system management operations within 2 hours.
- The system must handle multiple SPSOs making configuration adjustments simultaneously and notify SPSOs when more than one is making adjustments.
- The "Buy Printing Pages" feature must support payment via OCB bank.
- When the printer is faulty or overloaded, the user must be notified immediately via phone notification or registered email.
- The system must estimate and notify students of the printing completion time before printing.

### Security:
- The system does not save information about users' bank cards or bank accounts.
- The system allows the SPSO to view the printing history (log) of all students or a student for a selected period (date to date) and for all or specific printers.
- A student can only view their own printing log for a selected period, including a summary of printed pages for each page size.
- All users must be authenticated by the HCMUT_SSO authentication service before using the system.
- User passwords must be at least 8 characters long and include letters and numbers.

### Auditability:
- The system must log all printing actions for students, including student ID, printer ID, file name, printing start and end time, and the number of pages for each page size, stored in a database.
- The system should accurately log and track at least 98% of SPSO actions for accountability and auditing purposes.
- Log data must be in read-only mode, with users not allowed to edit log files.
- Reports on the use of the printing system are generated automatically at the end of each month and year, stored in the system, and viewable only by the SPSO at any time.

### Reliability:
- The system automatically refunds the page balance in case of printing errors.
- Upon completion of payment, the page balance for the user must be increased immediately.
- The system must complete at least 90% of accepted print requests on time.

### Performance:
- The response time of features must be no more than 5 seconds for both students and SPSOs.
- The system must handle at least 400 students simultaneously without errors.
- The system must complete the payment for a "Buy Printing Pages" order in no more than 3 seconds.

### Availability:
- The system must provide services to students during office hours: 8:00 a.m. to 6:00 p.m. Monday through Friday, and 9:00 a.m. to 5:00 p.m. on Saturday and Sunday.
- The system must provide service to the SPSO at all times.
- System downtime must be limited to no more than 5 hours per month.
- System maintenance must be performed outside of office hours.

### Compatibility:
- The system must be compatible with popular printer brands, such as Canon, Brother, HP, and Epson.
- The SPSO can easily add new printers to the list of used printers.
- The system must work on different browsers, including Chrome, Edge, Firefox, Opera, and Safari.
- The system must function on phones, computers, and tablets.

### Extensibility:
- The system should be able to expand to accommodate at least 5,000 additional users per year.

### Maintainability:
- The system must have a document. The document describes the system in detail.
- The system must be maintained when problems occur.

