const fast2sms=require('fast-two-sms')
exports.sendsms = async ({ message, contactNumber }, next) => {
    try {
      const res = await fast2sms.sendMessage({
        authorization: "AxQcEW9sGmp3grBNZ5nD14HFktIVbJaeX2yidTfOYv8KMjS0zqnmSl9Iyjc2xDQG1kCsvt5d3XhwL6b7",
        message,
        numbers: [contactNumber],
      });
      console.log(res);
    } catch (error) {
      next(error);
    }
  };
  