// const asyncHandler = (requestHandler)=> async(req , res , next) => {
//     try {
//         await requestHandler(req , res , next)
//     } catch (error) {
//         res.status(error.code || 500).json({
//             success: false,
//             message: error.message
//         })
//     }
// }

// export default asyncHandler;

const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next))
        .catch((err) => {
            console.error(err); // Log the error for debugging
            const statusCode = err.statusCode || 500; // Use the error's statusCode or default to 500
            res.status(statusCode).json({
                success: false,
                message: err.message || 'Internal Server Error',
            });
        });
};
export default asyncHandler