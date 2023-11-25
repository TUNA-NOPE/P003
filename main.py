from flask import Flask, render_template, jsonify, request
import pandas as pd

app = Flask(__name__)

# Load the Excel file data
excel_file = 'attendance.xlsx'

# Assuming the Excel file has columns like 'Class', 'Student Name', and 'Attendance'
try:
    # Explicitly specify dtype=str for 'Attendance' column
    data = pd.read_excel(excel_file, dtype={'Attendance': str})
except FileNotFoundError:
    data = pd.DataFrame(columns=['Class', 'Student Name', 'Attendance'])

# Extract unique class names
classes = data['Class'].unique().tolist()

# Map students to their respective classes
students_by_class = {}
for class_name in classes:
    students_by_class[class_name] = data[data['Class'] == class_name]['Student Name'].tolist()

# Default language
default_language = 'he'  # Default to Hebrew

@app.route('/get_classes', methods=['GET'])
def get_classes():
    return jsonify(classes)

@app.route('/get_students', methods=['POST'])
def get_students():
    selected_class = request.json['selected_class']
    students = students_by_class.get(selected_class, [])
    return jsonify(students)

@app.route('/update_attendance', methods=['POST'])
def update_attendance():
    selected_class = request.json['selected_class']
    selected_students = request.json['selected_students']
    attendance_status = request.json['attendance_status']
    
    # Assuming the 'Attendance' column needs to be converted to a string/object type
    data['Attendance'] = data['Attendance'].astype(str)

    # Update attendance status for selected students in the DataFrame
    for student in selected_students:
        # Check if the student exists in the selected class
        if student in students_by_class.get(selected_class, []):
            # Filter rows for the specific student in the selected class
            student_rows = data[(data['Class'] == selected_class) & (data['Student Name'] == student)]
            if not student_rows.empty:
                # Explicitly cast attendance_status to str before setting it
                data.loc[(data['Class'] == selected_class) & (data['Student Name'] == student), 'Attendance'] = str(attendance_status)

    # Save the updated data back to the Excel file
    data.to_excel(excel_file, index=False)
    
    return jsonify({'status': 'success'})



@app.route('/')
def index():
    lang_param = request.args.get('lang', default_language)
    return render_template('index.html', lang=lang_param)

if __name__ == '__main__':
    app.run()

