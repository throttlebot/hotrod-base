import sys, threading
import requests, random, time, math


customers = [123, 392, 731, 567]

alive = True


def work(host, id):
	global alive
	url = "http://" + host + "/"
	print "Thread {} starting".format(id)
	while alive:
		t = time.time()
		r = requests.get(url)
		payload = {'customer': str(random.choice(customers)), 'nonse': '0.022067955955792473'}
		r = requests.get(url + "dispatch", params=payload)
		time.sleep(max(5 - (time.time() - t), 0))
	print "Thread {} dying".format(id)


def start(host, num_threads):
	global alive
	threads = []
	for i in range(num_threads):
	    	t = threading.Thread(target=work, args=(host, i, ))
    		threads.append(t)
    		t.start()
    		time.sleep(random.random() / math.sqrt(num_threads))

	try:
		while True:
			time.sleep(1)
	except KeyboardInterrupt:
		alive = False
		print "Killing all threads: {}".format(not alive)


if __name__ == '__main__':
	
	start(sys.argv[1], int(sys.argv[2]))
