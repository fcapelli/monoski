all: demopandoc.html
%.html: %.md
	pandoc -t dzslides -s --template monoski.pandoc $< -o $@
