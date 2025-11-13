import sys
import requests
import qtawesome as qta

from PyQt5 import QtCore 

from PyQt5.QtCore import pyqtSignal, QThread, QPropertyAnimation, QEasingCurve, QSize
from PyQt5.QtWidgets import (
    QApplication, QMainWindow, QFileDialog, QTableWidgetItem, QVBoxLayout, QHBoxLayout,
    QWidget, QListWidget, QPushButton, QLabel, QListWidgetItem, QMessageBox,
    QAbstractItemView, QHeaderView, QDialog, QLineEdit, QFormLayout, QDialogButtonBox,
    QGraphicsDropShadowEffect
)
from PyQt5.QtGui import QColor
from ui_mainwindow import Ui_MainWindow

from matplotlib.backends.backend_qt5agg import FigureCanvasQTAgg as FigureCanvas
from matplotlib.figure import Figure
import matplotlib.pyplot as plt
import time


class LoginDialog(QDialog):
    def __init__(self, parent=None):
        super().__init__(parent)
        self.setWindowTitle("Login")
        self.setMinimumWidth(350)

        icon_label = QLabel()
        login_icon = qta.icon('fa5s.user-lock', color='#5694f2', color_active='#e0e1dd')
        icon_label.setPixmap(login_icon.pixmap(QSize(64, 64)))
        icon_label.setAlignment(QtCore.Qt.AlignCenter)

        title_label = QLabel("Authentication Required")
        title_label.setObjectName("headingLabel")
        title_label.setAlignment(QtCore.Qt.AlignCenter)

        self.username = QLineEdit(self)
        self.username.setPlaceholderText("Enter your username")
        self.password = QLineEdit(self)
        self.password.setPlaceholderText("Enter your password")
        self.password.setEchoMode(QLineEdit.Password)
        
        formLayout = QFormLayout()
        formLayout.addRow("Username:", self.username)
        formLayout.addRow("Password:", self.password)

        self.buttonBox = QDialogButtonBox(QDialogButtonBox.Ok | QDialogButtonBox.Cancel)
        self.buttonBox.accepted.connect(self.accept)
        self.buttonBox.rejected.connect(self.reject)

        mainLayout = QVBoxLayout()
        mainLayout.addWidget(icon_label)
        mainLayout.addWidget(title_label)
        mainLayout.addSpacing(20)
        mainLayout.addLayout(formLayout)
        mainLayout.addSpacing(20)
        mainLayout.addWidget(self.buttonBox)
        self.setLayout(mainLayout)

    def getCredentials(self):
        return self.username.text(), self.password.text()

class UploaderThread(QThread):
    success = pyqtSignal(dict)
    error = pyqtSignal(str)
    progress = pyqtSignal(int)

    def __init__(self, filepath, headers):
        super().__init__()
        self.filepath = filepath
        self.headers = headers

    def run(self):
        try:
            self.progress.emit(10)
            time.sleep(0.1)
            self.progress.emit(40)
            with open(self.filepath, 'rb') as f:
                response = requests.post('http://localhost:8000/api/upload/',
                                         files={'file': f},
                                         headers=self.headers)
            self.progress.emit(80)
            time.sleep(0.1)
            response.raise_for_status()
            data = response.json()
            self.progress.emit(100)
            self.success.emit(data)
        except requests.exceptions.RequestException as e:
            self.error.emit(f"API request failed: {e}")
        except Exception as e:
            self.error.emit(f"An unexpected error occurred: {e}")

class HistoryItemWidget(QWidget):
    def __init__(self, filename, date_str):
        super().__init__()
        self.setObjectName("historyItem") 

        layout = QHBoxLayout(self)
        layout.setContentsMargins(10, 5, 10, 5)

        icon_label = QLabel()
        file_icon = qta.icon('fa5s.file-csv', color='#88c0d0')
        icon_label.setPixmap(file_icon.pixmap(QSize(24, 24)))

        text_layout = QVBoxLayout()
        text_layout.setSpacing(0)
        
        filename_label = QLabel(filename)
        filename_label.setObjectName("historyFilename")
        
        date_label = QLabel(date_str)
        date_label.setObjectName("historyDate")

        text_layout.addWidget(filename_label)
        text_layout.addWidget(date_label)

        layout.addWidget(icon_label)
        layout.addLayout(text_layout)
        layout.addStretch()
        
class HistoryPanel(QWidget):
    datasetSelected = pyqtSignal(int)

    def __init__(self, parent=None, headers=None):
        super().__init__(parent)
        self.headers = headers
        self.history = []
        self.setupUi()
        self.connect_signals()

    def setupUi(self):
        layout = QVBoxLayout(self)
        self.historyList = QListWidget()
        self.refreshButton = QPushButton("Refresh")
        layout.addWidget(self.historyList)
        layout.addWidget(self.refreshButton)
        self.setMinimumWidth(250)

    def connect_signals(self):
        self.refreshButton.clicked.connect(self.fetch_history)
        self.historyList.itemClicked.connect(self.handle_item_click)

    def fetch_history(self):
        try:
            response = requests.get("http://localhost:8000/api/history/", headers=self.headers)
            response.raise_for_status()
            self.history = response.json()
            self.update_ui()
        except requests.exceptions.RequestException:
            self.historyList.clear()
            self.historyList.addItem("Error: Could not fetch history.")

    def update_ui(self):
        self.historyList.clear()
        if not self.history:
            empty_label = QLabel("No uploads yet.")
            empty_label.setAlignment(QtCore.Qt.AlignCenter)
            empty_item = QListWidgetItem(self.historyList)
            empty_item.setSizeHint(QSize(0, 50))
            self.historyList.setItemWidget(empty_item, empty_label)
            return
            
        for item in self.history:
            date_str = item.get('uploaded_at', 'Unknown date')
            filename = item.get('filename', 'Unknown file')
            
            history_item_widget = HistoryItemWidget(filename, date_str)

            list_item = QListWidgetItem(self.historyList)
            list_item.setData(1, item['id']) # Store the ID
            list_item.setSizeHint(history_item_widget.sizeHint())
            
            self.historyList.addItem(list_item)
            self.historyList.setItemWidget(list_item, history_item_widget)

    def handle_item_click(self, item):
        dataset_id = item.data(1)
        if dataset_id:
            self.datasetSelected.emit(dataset_id)
            
class MainWindow(QMainWindow):
    def __init__(self, auth_token):
        super(MainWindow, self).__init__()
        self.auth_token = auth_token
        self.api_headers = {'Authorization': f'Token {self.auth_token}'}
        self.ui = Ui_MainWindow()
        self.ui.setupUi(self)

        self.setWindowTitle("Chemical Equipment Visualizer") 

        try:
            with open('style.qss', 'r') as f:
                self.setStyleSheet(f.read())
        except FileNotFoundError:
            print("Warning: style.qss not found.")

        self.current_data_set = None
        self.history_panel = HistoryPanel(headers=self.api_headers)
        self.ui.historyLayout.addWidget(self.history_panel)

        self.setup_icons()
        self.polish_ui() 
        self.setup_charts()

        self.ui.uploadButton.clicked.connect(self.upload_csv_start)
        self.history_panel.datasetSelected.connect(self.handle_history_select)

        self.ui.uploadProgressBar.hide()
        self.history_panel.fetch_history()
        self.show()

    def apply_shadow(self, widget):
        shadow = QGraphicsDropShadowEffect(self)
        shadow.setBlurRadius(20)
        shadow.setColor(QColor(0, 0, 0, 150))
        shadow.setOffset(0, 5)
        widget.setGraphicsEffect(shadow)

    def fade_in_widget(self, widget):
        widget.show()
        self.anim = QPropertyAnimation(widget, b"windowOpacity")
        self.anim.setDuration(500)
        self.anim.setStartValue(0.0)
        self.anim.setEndValue(1.0)
        self.anim.setEasingCurve(QEasingCurve.InOutQuad)
        self.anim.start()

    def polish_ui(self):
        self.ui.dataTable.setEditTriggers(QAbstractItemView.NoEditTriggers)

        self.ui.dataTable.setAlternatingRowColors(True)
        self.ui.dataTable.setSelectionBehavior(QAbstractItemView.SelectRows)
        self.ui.dataTable.setSelectionMode(QAbstractItemView.SingleSelection)
        self.ui.dataTable.verticalHeader().setVisible(False)
        header = self.ui.dataTable.horizontalHeader()
        header.setSectionResizeMode(QHeaderView.ResizeToContents)
        header.setStretchLastSection(True)

        self.apply_shadow(self.ui.tabWidget)
        self.apply_shadow(self.ui.dataTable)

    def update_all_views(self, data):
        self.ui.tabWidget.hide()
        self.ui.dataTable.hide()

        self.update_bar_chart(data)
        self.update_pie_chart(data)
        self.update_parameter_chart(data)
        self.update_data_table(data)

        if data:
            self.fade_in_widget(self.ui.tabWidget)
            self.fade_in_widget(self.ui.dataTable)
        
    def setup_icons(self):
        icon_color = '#ffffff'
        upload_icon = qta.icon('fa5s.upload', color=icon_color)
        self.ui.uploadButton.setIcon(upload_icon)
        self.ui.uploadButton.setText(" Upload CSV File")
        refresh_icon = qta.icon('fa5s.sync-alt', color=icon_color)
        self.history_panel.refreshButton.setIcon(refresh_icon)
        self.history_panel.refreshButton.setText(" Refresh")
    
    def setup_charts(self):
        self.theme_bg_color = '#050822'
        self.theme_text_color = '#e0e1dd'
        self.theme_accent_color = '#5694f2'
        self.theme_grid_color = '#3d5a80'
        self.theme_highlight_color = '#e5c07b'
        self.bar_figure = Figure(facecolor=self.theme_bg_color)
        self.bar_canvas = FigureCanvas(self.bar_figure)
        bar_layout = QVBoxLayout(self.ui.barChartContainer)
        bar_layout.addWidget(self.bar_canvas)
        self.pie_figure = Figure(facecolor=self.theme_bg_color)
        self.pie_canvas = FigureCanvas(self.pie_figure)
        pie_layout = QVBoxLayout(self.ui.pieChartContainer)
        pie_layout.addWidget(self.pie_canvas)
        self.param_figure = Figure(facecolor=self.theme_bg_color)
        self.param_canvas = FigureCanvas(self.param_figure)
        param_layout = QVBoxLayout(self.ui.parameterContainer)
        param_layout.addWidget(self.param_canvas)
        self.update_all_views(None)

    def handle_history_select(self, dataset_id):
        try:
            response = requests.get(f"http://localhost:8000/api/datasets/{dataset_id}/",
                                    headers=self.api_headers)
            response.raise_for_status()
            self.current_data_set = response.json()
            self.update_all_views(self.current_data_set)
        except requests.exceptions.RequestException as e:
            QMessageBox.critical(self, "Error", f"Failed to load dataset: {e}")

    def upload_csv_start(self):
        filepath, _ = QFileDialog.getOpenFileName(self, "Open CSV File", "", "CSV Files (*.csv)")
        if not filepath: return
        self.ui.uploadButton.setEnabled(False)
        self.ui.uploadProgressBar.show()
        self.ui.uploadProgressBar.setValue(0)

        self.uploader = UploaderThread(filepath, self.api_headers)
        self.uploader.success.connect(self.upload_finished)
        self.uploader.error.connect(self.upload_failed)
        self.uploader.progress.connect(self.update_progress)
        self.uploader.start()

    def update_progress(self, value):
        self.ui.uploadProgressBar.setValue(value)

    def upload_finished(self, data):
        self.ui.uploadProgressBar.hide()
        self.ui.uploadButton.setEnabled(True)
        self.current_data_set = data
        self.update_all_views(data)
        self.history_panel.fetch_history()
        QMessageBox.information(self, "Success", "File uploaded and analyzed successfully!")

    def upload_failed(self, error_message):
        self.ui.uploadProgressBar.hide()
        self.ui.uploadButton.setEnabled(True)
        QMessageBox.critical(self, "Upload Failed", error_message)

    def update_all_views(self, data):
        self.update_bar_chart(data)
        self.update_pie_chart(data)
        self.update_parameter_chart(data)
        self.update_data_table(data)
    
    def set_mpl_style(self, ax):
        ax.set_facecolor(self.theme_bg_color)
        ax.tick_params(axis='x', colors=self.theme_text_color)
        ax.tick_params(axis='y', colors=self.theme_text_color)
        for spine in ax.spines.values():
            spine.set_edgecolor(self.theme_grid_color)
        ax.title.set_color(self.theme_text_color)
        ax.xaxis.label.set_color(self.theme_text_color)
        ax.yaxis.label.set_color(self.theme_text_color)
    
    def draw_empty_chart_message(self, figure, canvas):
        figure.clear()
        ax = figure.add_subplot(111)
        ax.text(0.5, 0.5, 'Upload a file or select from history to view analysis',
                horizontalalignment='center', verticalalignment='center',
                fontsize=12, color=self.theme_grid_color, transform=ax.transAxes)
        ax.set_facecolor(self.theme_bg_color)
        ax.axis('off')
        canvas.draw()

    def update_bar_chart(self, data):
        if not data:
            self.draw_empty_chart_message(self.bar_figure, self.bar_canvas)
            return
        summary = data.get('summary', {})
        distribution = summary.get('equipment_type_distribution', {})
        self.bar_figure.clear()
        ax = self.bar_figure.add_subplot(111)
        ax.bar(distribution.keys(), distribution.values(), color=self.theme_accent_color)
        ax.set_title('Equipment Type Distribution')
        ax.set_ylabel('Count')
        self.set_mpl_style(ax)
        self.bar_figure.tight_layout()
        self.bar_canvas.draw()
        
    def update_pie_chart(self, data):
        if not data:
            self.draw_empty_chart_message(self.pie_figure, self.pie_canvas)
            return
        summary = data.get('summary', {})
        distribution = summary.get('equipment_type_distribution', {})
        self.pie_figure.clear()
        ax = self.pie_figure.add_subplot(111)
        colors = ['#5694f2', '#3d5a80', '#e5c07b', '#b48ead', '#a3be8c']
        wedges, texts, autotexts = ax.pie(distribution.values(), autopct='%1.1f%%',
                                          startangle=140, textprops=dict(color="white", weight="bold"),
                                          colors=colors, wedgeprops={'edgecolor': self.theme_bg_color, 'linewidth': 2})
        legend = ax.legend(wedges, distribution.keys(), title="Equipment",
                   loc="center left", bbox_to_anchor=(1, 0, 0.5, 1),
                   labelcolor=self.theme_text_color,
                   facecolor='#080c32',
                   edgecolor='none')
        plt.setp(legend.get_title(), color=self.theme_accent_color, weight='bold')
        ax.set_title('Equipment Percentage')
        ax.axis('equal')
        self.set_mpl_style(ax)
        for spine in ax.spines.values():
            spine.set_visible(False)
        self.pie_figure.tight_layout()
        self.pie_canvas.draw()

    def update_parameter_chart(self, data):
        if not data:
            self.draw_empty_chart_message(self.param_figure, self.param_canvas)
            return
        original_data = data.get('original_data', [])
        self.param_figure.clear()
        ax = self.param_figure.add_subplot(111)
        pressures = [row.get('Pressure', 0) for row in original_data]
        temperatures = [row.get('Temperature', 0) for row in original_data]
        ax.scatter(pressures, temperatures, alpha=0.7, c=self.theme_highlight_color)
        ax.set_title('Pressure vs. Temperature')
        ax.set_xlabel('Pressure')
        ax.set_ylabel('Temperature')
        ax.grid(True, color=self.theme_grid_color, linestyle='--', linewidth=0.5)
        self.set_mpl_style(ax)
        self.param_figure.tight_layout()
        self.param_canvas.draw()

    def update_data_table(self, data):
        if not data:
            self.ui.dataTable.setRowCount(0)
            self.ui.dataTable.setColumnCount(0)
            return
        table_data = data.get('original_data', [])
        self.ui.dataTable.clearContents()
        headers = list(table_data[0].keys())
        self.ui.dataTable.setColumnCount(len(headers))
        self.ui.dataTable.setHorizontalHeaderLabels(headers)
        self.ui.dataTable.setRowCount(len(table_data))
        for row_index, row_data in enumerate(table_data):
            for col_index, header in enumerate(headers):
                cell_value = str(row_data.get(header, ''))
                self.ui.dataTable.setItem(row_index, col_index, QTableWidgetItem(cell_value))

if __name__ == '__main__':
    app = QApplication(sys.argv)
    try:
        with open('style.qss', 'r') as f:
            app.setStyleSheet(f.read())
    except FileNotFoundError:
        pass

    token = None
    while not token:
        login_dialog = LoginDialog()
        if login_dialog.exec_() == QDialog.Accepted:
            username, password = login_dialog.getCredentials()
            if not username or not password:
                QMessageBox.warning(None, "Input Error", "Username and password cannot be empty.")
                continue
            try:
                response = requests.post("http://localhost:8000/api/login/", data={
                    "username": username,
                    "password": password
                })
                if response.status_code == 200:
                    token = response.json().get('token')
                else:
                    error_msg = response.json().get('non_field_errors', ['Login failed. Please check your credentials.'])
                    QMessageBox.warning(None, "Login Failed", error_msg[0])
            except requests.exceptions.RequestException as e:
                QMessageBox.critical(None, "Connection Error", f"Could not connect to the server.\nPlease ensure the backend is running.\n\nError: {e}")
                sys.exit(1)
        else:
            sys.exit(0)

    window = MainWindow(auth_token=token)
    sys.exit(app.exec_())