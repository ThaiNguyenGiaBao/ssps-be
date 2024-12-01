class PrintingSystem {
    printerList: Printer[];
    studentList: Student[];
    printingLogList: PrintingLog[];
    defaultNumPage: number;
    dateGivePage: Date;
    permitedFile: FileType[];
}

class User {
    id: number;
    name: string;
    email: string;
    password: string;
}

class Student extends User {
    printingLog: PrintingLog; // Printing action
    pageBalance: number;

    getPrintingLog(startDate: Date, endDate: Date) {}
}

class SPSO extends User {
    printingSystem: PrintingSystem;
    reportList: _Report[];
    addPrinter(printer: Printer) {
        //this.printingSystem.printerList.push(printer);
    }
    enablePrinter(printerId: number) {}
    disablePrinter(printerId: number) {}

    setDefaultNumPage(numPage: number) {}
    setDefaultDateGivePage(date: Date) {}
    setPermitedFile(fileType: FileType[]) {}

    getPrintingLogForStudent(studentId: number, startTime: Date, endTime: Date) {}
    getPrintingLogForPrinter(printerId: number, startTime: Date, endTime: Date) {}
    getAllPrintingLog() {}

    generateReport(type: string) {}
}

enum FileType {
    PDF,
    DOCX,
    DOC,
    PPT,
    PPTX,
    XLSX,
    XLS,
    JPG,
    JPEG,
    PNG
}

class Printer {
    id: number;
    brand: string;
    model: string;
    shortDescription: string;
    location: Location;
    status: string;

    calculatePrice(file: DocumentFile) {
        return 1;
    }

    printFile( file: DocumentFile) {
        
    }
}

class _Location {
    campusName: string;
    buildingName: string;
    roomNumber: number;
}

class _Document {
    name: string;
    url: string; // the file does not store in the database, instead, it stores in cloud storage (AWS S3, Google Cloud Storage, etc.)
}

enum paperSize {
    A4,
    A3,
    A5
}

class DocumentFile {
    paperSize: paperSize;
    numPage: number;
    document: _Document;
    numSide: number; // 1 or 2
    numCopy: number;
}

class PrintingLog {
    studentId: number;
    printerId: number;
    fileList: DocumentFile[];
    printingStartTime: Date;
    printingEndTime: Date;

    getPrintingLog() {
        console.log("Printing Log for student", this.studentId);
        console.log("Printer ID", this.printerId);
        console.log("File list");
        this.fileList.forEach((file) => {
            console.log(file);
        });
        console.log("Printing start time", this.printingStartTime);
        console.log("Printing end time", this.printingEndTime);
        return this;
    }
}

class _Event {
    time: Date;
    type: string;
    description: string;
}

class _Report {
    id: number;
    name: string;
    generateDate: Date;
    type: string; // daily, weekly, monthly
    eventList: _Event[];

    addToReport(event) {
        this.eventList.push(event);
    }
}

class BKPay {
    addMoney(student: Student, amount: number) {
        student.pageBalance += amount;
    }
}

class SSO {
    authenticate() {}
    authorize() {}
}
