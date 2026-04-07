package com.topperthali.mess.ui

import android.content.Intent
import android.net.Uri
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import com.topperthali.mess.data.Payment
import com.topperthali.mess.data.Student

@Composable
fun WhatsAppShareButton(student: Student, payment: Payment) {
    val context = LocalContext.current
    
    Button(onClick = {
        val message = """
            Topper Thali Receipt
            Receipt ID: ${payment.receiptId}
            Amount: ₹${payment.amount}
            Thank you for your payment!
        """.trimIndent()
        
        val intent = Intent(Intent.ACTION_VIEW).apply {
            data = Uri.parse("https://api.whatsapp.com/send?phone=91${student.mobile}&text=${Uri.encode(message)}")
        }
        context.startActivity(intent)
    }) {
        Text("Share via WhatsApp")
    }
}
