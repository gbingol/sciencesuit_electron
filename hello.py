import json
import pkgutil
x = pkgutil.iter_modules()

lst = []
for i in x:
	if i.ispkg:
		dct = {"names":i.name, "locs":str(i.module_finder)}
		lst.append(dct)


print(json.dumps(lst))