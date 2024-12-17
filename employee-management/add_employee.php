<?php

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Origin: http://localhost:3000");
    header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Access-Control-Allow-Credentials: true");
    http_response_code(204);
    exit();
}

// For all other requests
header("Access-Control-Allow-Origin: http://localhost:3000"); // Set to your React app's domain
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");


error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once '../config.php'; // Ensure this path is correct
header("Content-Type: application/json");

// Decode the incoming JSON payload
$data = json_decode(file_get_contents("php://input"), true);

// Validate input fields
$requiredFields = ['employee_id', 'name', 'email', 'phone', 'department', 'date_of_joining', 'role'];
foreach ($requiredFields as $field) {
    if (!isset($data[$field])) {
        http_response_code(400); // Bad Request
        echo json_encode(["success" => false, "message" => "Invalid input. All fields are required."]);
        exit();
    }
}

// Sanitize and validate input data
$employee_id = trim($data['employee_id']);
$name = trim($data['name']);
$email = filter_var(trim($data['email']), FILTER_VALIDATE_EMAIL);
$phone = preg_match('/^[0-9]{10}$/', $data['phone']) ? $data['phone'] : null; // 10-digit phone number
$department = trim($data['department']);
$date_of_joining = trim($data['date_of_joining']); // Validate date format if needed
$role = trim($data['role']);

if (!$email || !$phone) {
    http_response_code(422); // Unprocessable Entity
    echo json_encode(["success" => false, "message" => "Invalid email or phone number format."]);
    exit();
}

try {
    // Get PDO instance
    $pdo = Database::getInstance();

    // Check for duplicate employee ID or email
    $stmt = $pdo->prepare("SELECT employee_id, email FROM employees WHERE employee_id = :employee_id OR email = :email");
    $stmt->execute(['employee_id' => $employee_id, 'email' => $email]);

    if ($stmt->rowCount() > 0) {
        http_response_code(409); // Conflict
        echo json_encode(["success" => false, "message" => "Employee ID or Email already exists."]);
        exit();
    }

    // Insert new employee into the database
    $stmt = $pdo->prepare(
        "INSERT INTO employees (employee_id, name, email, phone, department, date_of_joining, role) 
         VALUES (:employee_id, :name, :email, :phone, :department, :date_of_joining, :role)"
    );
    $stmt->execute([ 
        'employee_id' => $employee_id,
        'name' => $name,
        'email' => $email,
        'phone' => $phone,
        'department' => $department,
        'date_of_joining' => $date_of_joining,
        'role' => $role
    ]);

    // Return success response
    http_response_code(201); // Created
    echo json_encode(["success" => true, "message" => "Employee added successfully."]);

} catch (PDOException $e) {
    // Log error for debugging (in a real system, avoid displaying this to the user)
    error_log($e->getMessage(), 3, __DIR__ . '/error_log.log');
    http_response_code(500); // Internal Server Error
    echo json_encode(["success" => false, "message" => "An error occurred. Please try again later."]);
}
?>


