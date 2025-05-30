const fs = require('fs');
const path = require('path');

// __dirname is available by default in CommonJS
class CBNLogger {
  constructor() {
    this.logDir = path.join(__dirname, '../../logs');
    this.ensureLogDirectory();
  }

  ensureLogDirectory() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  formatTimestamp() {
    return new Date().toISOString();
  }

  getLogFileName(type = 'general') {
    const date = new Date().toISOString().split('T')[0];
    return path.join(this.logDir, `cbn_${type}_${date}.log`);
  }

  writeLog(filename, logEntry) {
    try {
      fs.appendFileSync(filename, logEntry + '\n', 'utf8');
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  }

  logTransaction(transactionData) {
    const logEntry = {
      timestamp: this.formatTimestamp(),
      type: 'TRANSACTION',
      transactionId: transactionData.transactionId,
      amount: transactionData.amount,
      currency: transactionData.currency || 'NGN',
      senderAccount: transactionData.senderAccount,
      receiverAccount: transactionData.receiverAccount,
      bankCode: transactionData.bankCode,
      narration: transactionData.narration,
      status: transactionData.status,
      ip: transactionData.ip,
      userAgent: transactionData.userAgent
    };

    const logString = JSON.stringify(logEntry);
    this.writeLog(this.getLogFileName('transactions'), logString);

    if (process.env.NODE_ENV === 'development') {
      console.log('CBN Transaction Log:', logEntry);
    }
  }

  logAPIRequest(requestData) {
    const logEntry = {
      timestamp: this.formatTimestamp(),
      type: 'API_REQUEST',
      method: requestData.method,
      url: requestData.url,
      headers: this.sanitizeHeaders(requestData.headers),
      body: this.sanitizeBody(requestData.body),
      ip: requestData.ip,
      userAgent: requestData.userAgent,
      userId: requestData.userId
    };

    const logString = JSON.stringify(logEntry);
    this.writeLog(this.getLogFileName('api_requests'), logString);
  }

  logAuthentication(authData) {
    const logEntry = {
      timestamp: this.formatTimestamp(),
      type: 'AUTHENTICATION',
      userId: authData.userId,
      action: authData.action,
      ip: authData.ip,
      userAgent: authData.userAgent,
      success: authData.success,
      failureReason: authData.failureReason
    };

    const logString = JSON.stringify(logEntry);
    this.writeLog(this.getLogFileName('authentication'), logString);
  }

  logSecurityEvent(eventData) {
    const logEntry = {
      timestamp: this.formatTimestamp(),
      type: 'SECURITY_EVENT',
      event: eventData.event,
      severity: eventData.severity,
      description: eventData.description,
      ip: eventData.ip,
      userId: eventData.userId,
      additionalData: eventData.additionalData
    };

    const logString = JSON.stringify(logEntry);
    this.writeLog(this.getLogFileName('security'), logString);
  }

  logBalanceInquiry(inquiryData) {
    const logEntry = {
      timestamp: this.formatTimestamp(),
      type: 'BALANCE_INQUIRY',
      accountNumber: inquiryData.accountNumber,
      userId: inquiryData.userId,
      ip: inquiryData.ip,
      bankCode: inquiryData.bankCode
    };

    const logString = JSON.stringify(logEntry);
    this.writeLog(this.getLogFileName('balance_inquiries'), logString);
  }

  sanitizeHeaders(headers) {
    const sanitized = { ...headers };
    const sensitiveHeaders = ['authorization', 'x-api-key', 'cookie'];

    sensitiveHeaders.forEach(header => {
      if (sanitized[header]) {
        sanitized[header] = '[REDACTED]';
      }
    });

    return sanitized;
  }

  sanitizeBody(body) {
    if (!body) return body;

    const sanitized = { ...body };
    const sensitiveFields = ['password', 'pin', 'token', 'secret', 'key'];

    sensitiveFields.forEach(field => {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    });

    return sanitized;
  }

  generateDailyReport(date = new Date()) {
    const dateStr = date.toISOString().split('T')[0];
    const reportData = {
      date: dateStr,
      totalTransactions: 0,
      totalAmount: 0,
      failedTransactions: 0,
      securityEvents: 0,
      authenticationAttempts: 0
    };

    const reportString = JSON.stringify(reportData, null, 2);
    this.writeLog(this.getLogFileName('daily_reports'), reportString);

    return reportData;
  }
}

const cbnLogger = new CBNLogger();

const logToCBN = (data) => {
  if (data.transactionId || data.amount) {
    cbnLogger.logTransaction(data);
  } else if (data.method && data.url) {
    cbnLogger.logAPIRequest(data);
  } else if (data.action && (data.action === 'LOGIN' || data.action === 'LOGOUT')) {
    cbnLogger.logAuthentication(data);
  } else if (data.event && data.severity) {
    cbnLogger.logSecurityEvent(data);
  } else if (data.accountNumber && !data.transactionId) {
    cbnLogger.logBalanceInquiry(data);
  } else {
    cbnLogger.logSecurityEvent({
      event: 'GENERAL_LOG',
      severity: 'INFO',
      description: 'General log entry',
      additionalData: data
    });
  }
};

// Export CommonJS-compatible module
module.exports = {
  cbnLogger,
  logToCBN,
  logTransaction: cbnLogger.logTransaction.bind(cbnLogger),
  logAPIRequest: cbnLogger.logAPIRequest.bind(cbnLogger),
  logAuthentication: cbnLogger.logAuthentication.bind(cbnLogger),
  logSecurityEvent: cbnLogger.logSecurityEvent.bind(cbnLogger),
  logBalanceInquiry: cbnLogger.logBalanceInquiry.bind(cbnLogger)
};
