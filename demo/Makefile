all: demopandoc.html
%.html: %.md
	pandoc -t s5 -s --template monoski.pandoc $< -o $@
