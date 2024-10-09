class PrintingSystem {
    printerList: Printer[];
    studentList: Student[];
    printingHistoryList: PrintingHistory[];
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
    file: DocumentFile;
    printingHistory: PrintingHistory; // Printing action
    pageBalance: number;

    getPrintingHistory(startDate: Date, endDate: Date) {}
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

    getPrintingHistoryForStudent(studentId: number, startTime: Date, endTime: Date) {}
    getPrintingHistoryForPrinter(printerId: number, startTime: Date, endTime: Date) {}
    getAllPrintingHistory() {}

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

    printFile(student: Student, file: DocumentFile) {
        // print file
        const price = this.calculatePrice(file);
        if (student.pageBalance < price) {
            console.log("Not enough balance");
            return;
        }

        // ...
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

class PrintingHistory {
    studentId: number;
    printerId: number;
    fileList: DocumentFile[];
    printingStartTime: Date;
    printingEndTime: Date;

    getPrintingHistory() {
        console.log("Printing history for student", this.studentId);
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
    date: Date;
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
