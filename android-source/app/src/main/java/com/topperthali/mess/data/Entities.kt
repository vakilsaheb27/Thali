package com.topperthali.mess.data

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "students")
data class Student(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val name: String,
    val mobile: String,
    val qrCode: String,
    val createdAt: Long = System.currentTimeMillis()
)

@Entity(tableName = "subscriptions")
data class Subscription(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val studentId: Int,
    val plan: String, // "Lunch", "Dinner", "Both"
    val startDate: Long,
    val endDate: Long,
    val remainingDays: Int,
    val status: String, // "Active", "Expired", "Cancelled"
    val createdAt: Long = System.currentTimeMillis()
)

@Entity(tableName = "attendance")
data class Attendance(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val studentId: Int,
    val date: String, // YYYY-MM-DD
    val meal: String, // "Lunch", "Dinner"
    val timestamp: Long = System.currentTimeMillis()
)

@Entity(tableName = "payments")
data class Payment(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val studentId: Int,
    val amount: Double,
    val date: Long = System.currentTimeMillis(),
    val receiptId: String
)

@Entity(tableName = "expenses")
data class Expense(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val description: String,
    val amount: Double,
    val date: Long = System.currentTimeMillis()
)
