from flask import Flask, request, jsonify
from worker import send_email_task

app = Flask(__name__)

@app.route("/queue-email", methods=["POST"])
def queue_email():
    data = request.json
    send_email_task.delay(
        data["to"],
        data["subject"],
        data["campaignId"],
        data["userId"],
        data["firstName"],
        data["couponCode"],
        data["expiryDate"],
    )
    return jsonify({"message": "Email queued"}), 200

if __name__ == "__main__":
    app.run(port=6000)
