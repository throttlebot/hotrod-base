import sys, threading, os
customers = [123, 392, 731, 567]

def work(url):
	os.system("ab -n 100000 -c 1 {}".format(url))

if __name__ == '__main__':
	host = sys.argv[1]
	target = "http://{}/dispatch?customer={}&nonse=0.022067955955792473"

	threads = []
	for i in range(4):
	    	t = threading.Thread(target=work, args=(target.format(host, customers[i]),))
    		threads.append(t)
    		t.start()
    		
	work("http://" +  host + "/")
