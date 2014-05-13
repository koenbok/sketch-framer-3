// Some sanity checks, before we begin:
var error = check_for_errors()

if(error) { // Stop execution and display error
  alert("Make sure to fix these before we can continue:\n\n" + error)
} else { // Let's go
  // Setup
  var ViewsMetadata = new MetadataExtractor()

  // Authorize
  authorize_app_to_save()
  make_export_folder()

  var views = extract_views_from_document()
  var loop = [views objectEnumerator]
  while(view = [loop nextObject]){
    export_assets_for_view(view)
  }

  // Traverse hierarchy to extract metadata
  if (document_has_artboards()) {
    var artboards = [[doc currentPage] artboards]
    for(var a=0; a < [artboards count]; a++){
      var artboard = [artboards objectAtIndex:a]
      ViewsMetadata.addView(artboard)
    }
  } else {
    var layers = [[doc currentPage] layers]
    var layerloop = [layers objectEnumerator]
    while(lay = [layerloop nextObject]){
      if(view_should_be_extracted(lay)){
        ViewsMetadata.addView(lay)
      }
    }
  }

  save_structure_to_json(ViewsMetadata)

  // All done!
  log("Export complete")
  [doc showMessage:"Export Complete"]
}