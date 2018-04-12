import json
import datetime
from TimeNormalizer import TimeNormalizer
from flask import Flask, jsonify, request

app = Flask(__name__)
tn = TimeNormalizer()

@app.route('/')
def hello():
  return 'Hello World!'

@app.route('/', methods=['POST'])
def time_nlp():
  data = request.get_data()
  param = json.loads(data)
  time = param['time']
  parse_res = json.loads(tn.parse(target=time))
  res = {}
  res['time'] = time
  res['result'] = parse_res
  return jsonify(res)

if __name__ == '__main__':
  app.run(port=4000)