import { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { db } from '../lib/db';
import { format } from 'date-fns';
import { CheckCircle2, XCircle, Camera } from 'lucide-react';

export default function Attendance() {
  const [scanResult, setScanResult] = useState<{ success: boolean; message: string; studentName?: string } | null>(null);
  const [mealType, setMealType] = useState<'Lunch' | 'Dinner'>('Lunch');
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    // Determine default meal type based on time
    const hour = new Date().getHours();
    if (hour >= 15) {
      setMealType('Dinner');
    } else {
      setMealType('Lunch');
    }
  }, []);

  const startScanner = () => {
    setIsScanning(true);
    setScanResult(null);
    
    // Small delay to ensure DOM is ready
    setTimeout(() => {
      const scanner = new Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );

      scanner.render(async (decodedText) => {
        scanner.clear();
        setIsScanning(false);
        await handleScan(decodedText);
      }, (error) => {
        // Ignore continuous scanning errors
      });
    }, 100);
  };

  const handleScan = async (qrCode: string) => {
    try {
      const student = await db.students.where('qrCode').equals(qrCode).first();
      
      if (!student) {
        setScanResult({ success: false, message: 'Invalid QR Code. Student not found.' });
        return;
      }

      const today = format(new Date(), 'yyyy-MM-dd');
      
      // Check active subscription
      const subscription = await db.subscriptions
        .where('studentId').equals(student.id!)
        .filter(sub => sub.status === 'Active' && (sub.plan === 'Both' || sub.plan === mealType))
        .first();

      if (!subscription) {
        setScanResult({ 
          success: false, 
          message: `No active ${mealType} subscription found.`,
          studentName: student.name
        });
        return;
      }

      // Check duplicate attendance
      const existing = await db.attendance
        .where('[studentId+date+meal]')
        .equals([student.id!, today, mealType])
        .first();

      if (existing) {
        setScanResult({ 
          success: false, 
          message: `Attendance already marked for ${mealType} today.`,
          studentName: student.name
        });
        return;
      }

      // Mark attendance
      await db.attendance.add({
        studentId: student.id!,
        date: today,
        meal: mealType,
        timestamp: new Date()
      });

      setScanResult({ 
        success: true, 
        message: `Attendance marked successfully for ${mealType}.`,
        studentName: student.name
      });

    } catch (error) {
      console.error('Scan error:', error);
      setScanResult({ success: false, message: 'An error occurred while processing.' });
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">QR Attendance</h1>
        <p className="text-gray-500 mt-1">Scan student QR code to mark attendance</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setMealType('Lunch')}
            className={`px-6 py-2 rounded-full font-medium transition-colors ${
              mealType === 'Lunch' 
                ? 'bg-orange-600 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Lunch
          </button>
          <button
            onClick={() => setMealType('Dinner')}
            className={`px-6 py-2 rounded-full font-medium transition-colors ${
              mealType === 'Dinner' 
                ? 'bg-orange-600 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Dinner
          </button>
        </div>

        {isScanning ? (
          <div className="space-y-4">
            <div id="reader" className="overflow-hidden rounded-lg border-2 border-orange-200"></div>
            <button 
              onClick={() => {
                setIsScanning(false);
                // The scanner instance needs to be cleared properly in a real app, 
                // but for this demo, unmounting the div works mostly fine.
                window.location.reload(); // Quick hack to clear scanner
              }}
              className="w-full py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel Scanning
            </button>
          </div>
        ) : (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-xl">
            <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Scan</h3>
            <p className="text-gray-500 mb-6">Position the QR code within the camera frame</p>
            <button
              onClick={startScanner}
              className="px-6 py-3 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors"
            >
              Start Scanner
            </button>
          </div>
        )}

        {scanResult && !isScanning && (
          <div className={`mt-6 p-4 rounded-xl flex items-start gap-3 ${
            scanResult.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            {scanResult.success ? (
              <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0" />
            ) : (
              <XCircle className="w-6 h-6 text-red-600 shrink-0" />
            )}
            <div>
              {scanResult.studentName && (
                <p className="font-bold mb-1">{scanResult.studentName}</p>
              )}
              <p>{scanResult.message}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
