package com.topperthali.mess.data

import androidx.room.*
import kotlinx.coroutines.flow.Flow

@Dao
interface MessDao {
    // Students
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertStudent(student: Student): Long

    @Query("SELECT * FROM students ORDER BY id DESC")
    fun getAllStudents(): Flow<List<Student>>

    @Query("SELECT * FROM students WHERE qrCode = :qrCode LIMIT 1")
    suspend fun getStudentByQr(qrCode: String): Student?

    @Delete
    suspend fun deleteStudent(student: Student)

    // Subscriptions
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertSubscription(subscription: Subscription)

    @Query("SELECT * FROM subscriptions WHERE studentId = :studentId AND status = 'Active' LIMIT 1")
    suspend fun getActiveSubscription(studentId: Int): Subscription?

    @Query("SELECT * FROM subscriptions ORDER BY id DESC")
    fun getAllSubscriptions(): Flow<List<Subscription>>

    @Update
    suspend fun updateSubscription(subscription: Subscription)

    // Attendance
    @Insert(onConflict = OnConflictStrategy.IGNORE)
    suspend fun insertAttendance(attendance: Attendance): Long

    @Query("SELECT * FROM attendance WHERE date = :date")
    fun getAttendanceByDate(date: String): Flow<List<Attendance>>

    @Query("SELECT COUNT(*) FROM attendance WHERE studentId = :studentId AND date = :date AND meal = :meal")
    suspend fun checkAttendanceExists(studentId: Int, date: String, meal: String): Int

    // Payments
    @Insert
    suspend fun insertPayment(payment: Payment)

    @Query("SELECT * FROM payments ORDER BY date DESC")
    fun getAllPayments(): Flow<List<Payment>>

    // Expenses
    @Insert
    suspend fun insertExpense(expense: Expense)

    @Query("SELECT * FROM expenses ORDER BY date DESC")
    fun getAllExpenses(): Flow<List<Expense>>
}
