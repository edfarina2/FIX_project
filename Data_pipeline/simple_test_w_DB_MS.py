from modules import FIX_fragment
from modules import DB_interface_MS as DB_interface

a = FIX_fragment.FIX_fragment()
a.Load_from_TradString("2023-03-09 09:36:00.303_486 [SystemB] (INFO) : 8=FIX.4.4|9=161|35=8|34=2|49=DEST|52=20181023-20:26:27.359|56=DEV|6=0|11=YLWC3xFi6ygIxFSKVY|14=0|17=43|37=42|38=2.0|39=0|54=2|55=BTCUSD|60=20150218-18:45:02.042|150=0|151=2.0|10=113|")



DB = DB_interface.DB_interface()
DB.Connect()

DB.AddFIXToDB(a)



a.Check_FIX_frag()
a.Check_FIX_frag_length()

a = FIX_fragment.FIX_fragment("8=FIX.4.2|9=65|35=A|49=SERVER|56=CLIENT|34=177|52=20090107-18:15:16|98=0|108=30|10=062|")
a.Check_FIX_frag()
a.Check_FIX_frag_length()

a = FIX_fragment.FIX_fragment("8=FIX.4.2|9=178|35=8|49=PHLX|56=PERS|52=20071123-05:30:00.000|11=ATOMNOCCC9990900|20=3|150=E|39=E|55=MSFT|167=CS|54=1|38=15|40=2|44=15|58=PHLX EQUITY TESTING|59=0|47=C|32=0|31=0|151=15|14=0|6=0|10=128|")
a.Check_FIX_frag()
a.Check_FIX_frag_length()



