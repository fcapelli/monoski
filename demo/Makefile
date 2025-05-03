all: demopandoc.html
%.html: %.md
	pandoc -t revealjs -s --template monoski.pandoc $< -o $@
