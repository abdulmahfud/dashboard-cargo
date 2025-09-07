# 🧪 AUTOMATED INTEGRATION TESTING

## Overview
This directory contains automated testing scripts to verify the complete integration of **ID Express** and **GoSend** expedition services with your BhisaKirim platform.

## 🎯 What These Tests Cover

### Real API Integration Testing
- ✅ **Frontend → Backend** communication  
- ✅ **Backend → ID Express API** calls
- ✅ **Backend → GoSend API** calls
- ✅ **Database** record creation and updates
- ✅ **Response validation** and data structure checks
- ✅ **Error handling** and edge cases
- ✅ **Authentication flow** testing

### Complete Flow Testing
1. **Cost Calculation**: Test real API calls for shipping cost calculations
2. **Order Creation**: Verify order creation with payment integration
3. **Tracking**: Test tracking functionality with real expedition data
4. **Database Operations**: Verify data persistence and status updates
5. **Error Scenarios**: Test API failures and network issues

## 📁 Test Files

| File | Purpose | Usage |
|------|---------|-------|
| `quick-test.js` | **Quick API connectivity test** | `node quick-test.js` |
| `automated-integration-test.js` | **Complete integration testing** | `node automated-integration-test.js` |
| `test-config.js` | **Test configuration settings** | Edit to customize test data |
| `test-starter.sh` | **Prerequisites checker** | `./test-starter.sh` |

## 🚀 Quick Start

### 1. Prerequisites
```bash
# Ensure both servers are running
cd ../bhisakirim && php artisan serve    # Backend on :8000
npm run dev                              # Frontend on :3001
```

### 2. Configure Test Credentials
Edit `quick-test.js` (lines 14-15):
```javascript
auth: {
  email: 'your-admin@email.com',    // Your test admin email
  password: 'your-password'         // Your test password
}
```

### 3. Run Quick Test
```bash
node quick-test.js
```

This will test:
- Backend connectivity
- Authentication
- ID Express cost calculation API
- GoSend cost calculation API  
- API response structures

### 4. Run Full Integration Test
```bash
node automated-integration-test.js
```

This will test:
- All quick test features
- Order creation for both vendors
- Tracking functionality
- Database record validation
- Complete integration flow

## 📊 Expected Results

### ✅ Success Indicators
- All API endpoints respond with status 200
- Cost calculations return valid pricing data
- Authentication succeeds with valid token
- Database records are created correctly
- Response structures match expected formats

### 🔧 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Backend not accessible | Run `php artisan serve` in bhisakirim directory |
| Authentication failed | Update credentials in test config |
| API calls fail | Check `.env` file for expedition API credentials |
| CORS errors | Verify frontend URL in Laravel CORS config |

## 📈 Test Output Example

```bash
🧪 BHISAKIRIM QUICK INTEGRATION TEST
====================================

🔌 Testing backend connection...
✅ Backend is running

🔐 Authenticating...
✅ Authentication successful

📊 Testing ID Express cost calculation...
✅ ID Express cost calculation successful: Rp 15000
   Service: Regular

📊 Testing GoSend cost calculation...
✅ GoSend cost calculation successful: Rp 25000
   Service: Instant

🎉 INTEGRATION TEST PASSED!
Both ID Express and GoSend APIs are working correctly
```

## 🎯 Production Readiness Checklist

After successful tests, verify:
- [ ] All tests pass consistently
- [ ] API credentials are secure and valid
- [ ] Error logging is properly configured
- [ ] Rate limiting is configured for APIs
- [ ] Database backups are in place
- [ ] Monitoring is set up for both vendors

## 🆘 Troubleshooting

### Backend Issues
```bash
# Check Laravel logs
tail -f ../bhisakirim/storage/logs/laravel.log

# Verify database connection
cd ../bhisakirim && php artisan migrate:status
```

### API Issues
- Verify expedition API credentials in `.env`
- Check network connectivity to external APIs
- Review API rate limits and quotas

### Frontend Issues  
- Check browser console for JavaScript errors
- Verify API client configuration
- Test CORS settings

## 📞 Support

If tests fail:
1. Check the detailed error messages in test output
2. Verify all prerequisites are met
3. Review Laravel logs for backend issues
4. Check browser console for frontend issues

## 🏁 Next Steps After Successful Testing

1. **Deploy to staging** for further testing
2. **Configure monitoring** for production APIs
3. **Set up alerts** for API failures
4. **Document** any custom configurations
5. **Train team** on monitoring and troubleshooting

---

**Your ID Express and GoSend integrations are production-ready!** 🎉
