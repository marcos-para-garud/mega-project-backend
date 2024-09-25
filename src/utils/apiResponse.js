// // // class apiResponse{
// // //     constructor(statusCode , data , message="Success"){
      
// // //         this.statusCode = statusCode
// // //         this.data = data
// // //         this.message = message
// // //         this.success = statusCode < 400
// // //     }
// // // }

// // // export default apiResponse



// // class apiResponse {
// //     constructor(statusCode, data, message = "Success") {
// //         // Ensure statusCode is a valid HTTP code
// //         this.statusCode = typeof statusCode === 'number' && statusCode >= 100 && statusCode < 600 ? statusCode : 500;
// //         this.data = data;
// //         this.message = message;
// //         this.success = this.statusCode < 400; // Success is true if statusCode is less than 400
// //     }
// // }

// // export default apiResponse;


// class apiResponse {
//     constructor(statusCode, data, message = "Success") {
//         // Ensure statusCode is a valid HTTP code
//         if (typeof statusCode === 'number' && statusCode >= 100 && statusCode < 600) {
//             this.statusCode = statusCode;
//         } else {
//             console.log(`Invalid status code: ${statusCode}`); // Log invalid status code
//             this.statusCode = 500; // Default to 500 in case of invalid status
//         }
//         this.data = data;
//         this.message = message;
//         this.success = this.statusCode < 400; // Success is true if statusCode is less than 400
//     }
// }
// export default apiResponse;


class apiResponse {
    constructor(statusCode, data, message = "Success") {
        if (typeof statusCode === 'number' && statusCode >= 100 && statusCode < 600) {
            this.statusCode = statusCode;
        } else {
            console.log(`Invalid status code: ${statusCode}`); // Log invalid status code
            this.statusCode = 500; // Default to 500 in case of invalid status
        }
        this.data = data;
        this.message = message;
        this.success = this.statusCode < 400; // Success is true if statusCode is less than 400
    }
}
export default apiResponse