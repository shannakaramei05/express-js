Resources		
GET	/resources	Get all warehouse items
POST	/resources	Add new resource
PATCH	/resources/:id	Update resource details

Transactions		
GET	/transactions	Get all inventory movements
POST	/transactions	Log stock movement (IN/OUT)

Shipments		
POST	/shipments	Request a shipment
PATCH	/shipments/:id/approve	Approve shipment
PATCH	/shipments/:id/reject	Reject shipment

Restock Requests		
POST	/restock-requests	Request new stock
PATCH	/restock-requests/:id/approve	Approve restock
PATCH	/restock-requests/:id/receive	Mark as received