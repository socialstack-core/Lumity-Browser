
using Api.Database;
using Api.Translate;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Reflection;
using System.Threading.Tasks;

namespace Api.Startup {
	
	/// <summary>
	/// Tracks fields which have changed, without allocating anything. 
	/// Note that this is field specific (because only fields are persistent). Properties do not work.
	/// Limited to 64 fields on an object.
	/// </summary>
	public struct ChangedFields {
		
		/// <summary>
		/// Specific map of fields.
		/// </summary>
		public ChangedFields(ulong map){
		}

	}
	
	/// <summary>
	/// A map of field name -> field on a Content type. 
	/// This level does not consider e.g. role accessibility - it is just a raw, complete set of fields and properties, including virtual ones.
	/// </summary>
	public class ContentFields
	{

		/// <summary>
		///  Common field names used by entities which are used as a title when no [Meta("title")] is declared.
		/// </summary>
		private readonly static string[] CommonTitleNames = new string[] { "fullname", "username", "firstname", "title", "name", "url" }; // Title itself isn't first as some user tables have "title" (as in Mr/s etc).

		/// <summary>
		///  Common field names used by entities which are used as a description when no [Meta("description")] is declared.
		/// </summary>
		private readonly static string[] CommonDescriptionNames = new string[] { "description", "shortdescription", "bio", "biography", "about" };
		
		/// <summary>
		/// Global virtual fields. ListAs appears in here.
		/// </summary>
		public static Dictionary<string, ContentField> _globalVirtualFields = new Dictionary<string, ContentField>();

		/// <summary>
		/// Inclusion sets that have been pre-generated, rooted from this set.
		/// </summary>
		public ConcurrentDictionary<string, IncludeSet> includeSets = new ConcurrentDictionary<string, IncludeSet>();

		/// <summary>
		/// The AutoService that this map is for.
		/// </summary>
		public AutoService Service;

		/// <summary>
		/// The type that this map is for.
		/// </summary>
		public Type InstanceType;
		
		/// <summary>
		/// Creates a map for the given autoservice's instance type.
		/// Use aService.GetChangeField(..); rather than this directly.
		/// </summary>
		public ContentFields(AutoService service)
		{
			Service = service;
			InstanceType = service.InstanceType;
			BuildMap();
		}
		
		/// <summary>
		/// Creates a map for the given type.
		/// Use aService.GetChangeField(..); rather than this directly.
		/// </summary>
		public ContentFields(Type instanceType)
		{
			InstanceType = instanceType;
			BuildMap();
		}

		/// <summary>
		/// Gets a local virtual field of the given type, or null if it doesn't exist.
		/// </summary>
		/// <param name="ofType"></param>
		/// <param name="name"></param>
		/// <returns></returns>
		public ContentField GetVirtualField(Type ofType, string name)
		{
			if (_vList == null)
			{
				return null;
			}

			foreach (var virt in _vList)
			{
				if (virt.VirtualInfo.Type == ofType && virt.VirtualInfo.FieldName == name)
				{
					return virt;
				}
			}

			return null;
		}

		/// <summary>
		/// Gets the include set using the given str.
		/// </summary>
		/// <param name="includeString"></param>
		/// <returns></returns>
		public async ValueTask<IncludeSet> GetIncludeSet(string includeString)
		{
			if (string.IsNullOrEmpty(includeString))
			{
				return null;
			}

			var lowerIncludes = includeString.ToLower();

			if (!includeSets.TryGetValue(lowerIncludes, out IncludeSet result))
			{
				result = new IncludeSet(lowerIncludes, this);
				await result.Parse();
				includeSets[lowerIncludes] = result;
			}

			return result;
		}

		/// <summary>
		/// Raw field list.
		/// </summary>
		private List<ContentField> _list;
		
		/// <summary>
		/// Raw virtual field list.
		/// </summary>
		private List<ContentField> _vList;
		
		/// <summary>
		/// The underlying mapping.
		/// </summary>
		private Dictionary<string, ContentField> _nameMap;
		
		/// <summary>
		/// Meta field mapping.
		/// </summary>
		private Dictionary<string, ContentField> _metaMap;
		
		/// <summary>
		/// The underlying mapping.
		/// </summary>
		private Dictionary<string, ContentField> _vNameMap;

		/// <summary>
		/// Raw field list.
		/// </summary>
		public List<ContentField> List{
			get{
				return _list;
			}
		}

		/// <summary>
		/// Map of meta field name -> field.
		/// </summary>
		public Dictionary<string, ContentField> MetaFieldMap
		{
			get
			{
				return _metaMap;
			}
		}

		/// <summary>
		/// List of virtual fields.
		/// </summary>
		public List<ContentField> VirtualList
		{
			get
			{
				return _vList;
			}
		}

		/// <summary>
		/// Virtual field name mapped to entry on this type only, lowercase.
		/// </summary>
		public Dictionary<string, ContentField> LocalVirtualNameMap
		{
			get
			{
				return _vNameMap;
			}
		}

		/// <summary>
		/// Raw field map, lowercase.
		/// </summary>
		public Dictionary<string, ContentField> NameMap{
			get{
				return _nameMap;
			}
		}

		/// <summary>
		/// The db index list.
		/// </summary>
		public List<DatabaseIndexInfo> IndexList {
			get {
				return _indexSet;
			}
		}

		/// <summary>
		/// The name of the primary ListAs, if there is one.
		/// </summary>
		public string PrimaryMapName;
		
		/// <summary>
		/// The primary ListAs, if there is one.
		/// </summary>
		public ContentField PrimaryMap;

		private List<DatabaseIndexInfo> _indexSet;

		/// <summary>
		/// Gets the first match of any of the given field names. They must be lowercase. Null if none exist.
		/// </summary>
		/// <param name="fieldNames"></param>
		/// <returns></returns>
		public ContentField TryGetAnyOf(string[] fieldNames)
		{
			for (var i = 0; i < fieldNames.Length; i++)
			{
				if (_nameMap.TryGetValue(fieldNames[i], out ContentField result))
				{
					return result;
				}
			}

			return null;
		}
		
		private void BuildMap()
		{
			if (InstanceType == null)
			{
				// There is no type.
				return;
			}

			// Start collecting db indices:
			_indexSet = new List<DatabaseIndexInfo>();

			// Add global listAs attribs, if there is any:
			var listAsSet = InstanceType.GetCustomAttributes<ListAsAttribute>();

			// Get the implicit types, if there are any:
			var implicitSet = InstanceType.GetCustomAttributes<ImplicitForAttribute>();

			List<ContentField> listAsFields = null;

			if (listAsSet != null)
			{
				ListAsAttribute primary = null;

				foreach (var listAs in listAsSet)
				{
					List<Type> implicitTypes = null;

					foreach(var implicitAttrib in implicitSet)
					{
						if (implicitAttrib.ListAsName == listAs.FieldName)
						{
							if (implicitTypes == null)
							{
								implicitTypes = new List<Type>();
							}

							implicitTypes.Add(implicitAttrib.Type);
						}
					}

					if (listAs.Explicit && implicitTypes == null)
					{
						implicitTypes = new List<Type>();
					}

					var listAsField = new ContentField(new VirtualInfo()
					{
						FieldName = listAs.FieldName,
						Type = InstanceType,
						ImplicitTypes = implicitTypes,
						IsList = true,
						IdSourceField = "Id"
					});

					if (listAs.IsPrimary)
					{
						if (primary != null)
						{
							throw new Exception(
								"Multiple primary ListAs attributes specified on type '" + InstanceType.Name + 
								"'. If a type has more than one ListAs, only one can be the primary one. " + 
								primary.FieldName + " and " + listAs.FieldName + " are currently both set to primary. Use IsPrimary=false on one of them."
							);
						}

						primary = listAs;
						PrimaryMapName = listAs.FieldName;
						PrimaryMap = listAsField;
					}

					_globalVirtualFields[listAs.FieldName.ToLower()] = listAsField;

					if (listAsFields == null)
					{
						listAsFields = new List<ContentField>();
					}

					listAsFields.Add(listAsField);
				}
			}

			// Public fields:
			var fields = InstanceType.GetFields();

			_nameMap = new Dictionary<string, ContentField>();
			_metaMap = new Dictionary<string, ContentField>();
			_list = new List<ContentField>();
			_vNameMap = new Dictionary<string, ContentField>();
			_vList = new List<ContentField>();

			for (var i=0;i<fields.Length;i++){
				var field = fields[i];
				var cf = new ContentField(field);
				_list.Add(cf);
				cf.Id = _list.Count;
				_nameMap[field.Name.ToLower()] = cf;
				
				// Get field attributes:
				var attribs = field.GetCustomAttributes(true);

				foreach (var attrib in attribs)
				{
					if (attrib is DatabaseIndexAttribute attribute)
					{
						// Add db index:
						var dbi = new DatabaseIndexInfo(attribute, new ContentField[] { cf });
						dbi.Id = _indexSet.Count;
						cf.AddIndex(dbi);
						_indexSet.Add(dbi);
					}

					if (attrib is LocalizedAttribute)
					{
						cf.Localised = true;
					}

					if (attrib is MetaAttribute)
					{
						_metaMap[(attrib as MetaAttribute).FieldName.ToLower()] = cf;
					}
				}
			}

			// Do we have a title and description meta field?
			// If not, we'll attempt to invent them based on some common names.
			if (!_metaMap.ContainsKey("title"))
			{
				var titleField = TryGetAnyOf(CommonTitleNames);
				if (titleField != null)
				{
					_metaMap["title"] = titleField;
				}
			}

			if (!_metaMap.ContainsKey("description"))
			{
				var descriptionField = TryGetAnyOf(CommonDescriptionNames);
				if (descriptionField != null)
				{
					_metaMap["description"] = descriptionField;
				}
			}

			// Collect any databaseIndex attributes on the type itself:
			var attributes = InstanceType.GetCustomAttributes(true);

			foreach (var attrib in attributes)
			{
				if (attrib is DatabaseIndexAttribute attribute)
				{
					var indexFields = attribute.Fields;

					if (indexFields == null || indexFields.Length == 0)
					{
						throw new ArgumentException("You've got a [DatabaseIndex] on " + InstanceType.Name + " which requires fields but has none.");
					}

					var columnFields = new ContentField[indexFields.Length];

					for (var i = 0; i < indexFields.Length; i++)
					{
						if (!_nameMap.TryGetValue(indexFields[i].ToLower(), out ContentField reffedIndexField))
						{
							// All the reffed fields must exist.
							throw new ArgumentException(
								"A [DatabaseIndex] on '" + InstanceType.Name + "' tries to use a field called '" + indexFields[i] + "' which doesn't exist. " +
								"Note that properties can't be used in an index."
							);
						}

						columnFields[i] = reffedIndexField;
					}

					var dbi = new DatabaseIndexInfo(attribute, columnFields);
					dbi.Id = _indexSet.Count;

					for (var i = 0; i < columnFields.Length; i++)
					{
						columnFields[i].AddIndex(dbi);
					}

					_indexSet.Add(dbi);
				}
			}

			var properties = InstanceType.GetProperties();
			
			// Public properties (can't be localised):
			for(var i=0;i<properties.Length;i++){
				var property = properties[i];
				var cf = new ContentField(property);
				_list.Add(cf);
				cf.Id = _list.Count;
				_nameMap[property.Name.ToLower()] = cf;
			}

			// Get all the virtuals:
			var virtualFields = InstanceType.GetCustomAttributes<HasVirtualFieldAttribute>();

			foreach (var fieldMeta in virtualFields)
			{
				var vInfo = new VirtualInfo()
				{
					FieldName = fieldMeta.FieldName,
					Type = fieldMeta.Type,
					IdSourceField = fieldMeta.IdSourceField
				};

				if (vInfo.Type == null)
				{
					throw new PublicException("Virtual fields require a type. '" + vInfo.FieldName + "' on '" + InstanceType.Name + "' does not have one.", "field_type_required");
				}

				var cf = new ContentField(vInfo);

				// Resolve ID sources:
				if (!string.IsNullOrEmpty(vInfo.IdSourceField))
				{
					if (!_nameMap.TryGetValue(vInfo.IdSourceField.ToLower(), out vInfo.IdSource))
					{
						throw new PublicException("A field called '" + vInfo.IdSourceField + "' doesn't exist as requested by virtual field '" + vInfo.FieldName + "' on type " + InstanceType.Name, "vfield_require_doesnt_exist");
					}

					if (vInfo.IdSource != null && vInfo.IdSource.UsedByVirtual == null)
					{
						vInfo.IdSource.UsedByVirtual = cf;
					}
				}

				_vList.Add(cf);
				cf.Id = _vList.Count;
				_vNameMap[vInfo.FieldName.ToLower()] = cf;
			}

			if (listAsFields != null)
			{
				// Mark its meta title field.
				if (_metaMap.TryGetValue("title", out ContentField cf))
				{
					for (var i = 0; i < listAsFields.Count; i++)
					{
						listAsFields[i].VirtualInfo.MetaTitleField = cf;
					}
				}
			}

		}

		/// <summary>
		/// Attempts to get the named field.
		/// </summary>
		public bool TryGetValue(string fieldName, out ContentField field){
			return _nameMap.TryGetValue(fieldName, out field);
		}
		
	}
	
	/// <summary>
	/// A field or property on a Content type.
	/// </summary>
	public partial class ContentField
	{
		/// <summary>
		/// The depth of a virtual field. "A.B" has a depth of 1, "A" a depth of 0 and "A.B.C" a depth of 2.
		/// </summary>
		public int VirtualDepth;

		/// <summary>
		/// The first virtual field that this field is used by (applies to local mappings only).
		/// </summary>
		public ContentField UsedByVirtual;

		/// <summary>
		/// True if this field is [Localised]
		/// </summary>
		public bool Localised;

		/// <summary>
		/// This fields ID. It also directly represents the change flag.
		/// </summary>
		public int Id{
			get{
				return _id;
			}
			set{
				_id = value;
			}
		}

		/// <summary>
		/// The type an ID collector uses. This is generated.
		/// </summary>
		public Type IDCollectorType
		{
			get {
				return _idCollectorType;
			}
		}

		/// <summary>
		/// IDCollector concrete type for this field, if it represents some kind of ID. 
		/// This collector type is generated and reads the value of this field from a given object.
		/// </summary>
		private Type _idCollectorType;

		/// <summary>
		/// First ID collector in the pool for this field.
		/// </summary>
		private IDCollector FirstInPool;

		/// <summary>
		/// ID collector pool lock.
		/// </summary>
		private object IDCollectorPoolLock = new object();

		/// <summary>
		/// Gets an ID collector from a pool.
		/// </summary>
		/// <returns></returns>
		public IDCollector RentCollector()
		{
			IDCollector instance = null;

			lock (IDCollectorPoolLock)
			{
				if (FirstInPool != null)
				{
					// Pop from the pool:
					instance = FirstInPool;
					FirstInPool = instance.NextCollector;
				}
			}

			if (instance == null)
			{
				// Instance one:
				instance = Activator.CreateInstance(IDCollectorType) as IDCollector;
				instance.Pool = this;
			}

			instance.NextCollector = null;
			return instance;
		}

		/// <summary>
		/// Returns the given collector to the pool. This also internally releases the collector's buffers.
		/// </summary>
		/// <param name="collector"></param>
		public void AddToPool(IDCollector collector)
		{
			// Re-add to this pool:
			lock (IDCollectorPoolLock)
			{
				collector.NextCollector = FirstInPool;
				FirstInPool = collector;
			}
		}

		/// <summary>
		/// Sets the ID collector type.
		/// </summary>
		/// <param name="type"></param>
		public void SetIDCollectorType(Type type)
		{
			_idCollectorType = type;
		}

		/// <summary>
		/// True if this is a virtual field.
		/// </summary>
		public bool IsVirtual
		{
			get {
				return VirtualInfo != null;
			}
		}

		/// <summary>
		/// This fields ID. It also directly represents the change flag.
		/// </summary>
		private int _id;
		
		/// <summary>
		/// Underlying field (can be null if it's a property).
		/// </summary>
		public FieldInfo FieldInfo;
		
		/// <summary>
		/// Underlying propertyInfo (can be null if it's a field).
		/// </summary>
		public PropertyInfo PropertyInfo;

		/// <summary>
		/// Virtual field information.
		/// </summary>
		public VirtualInfo VirtualInfo;

		/// <summary>
		/// Set if this field is used by any database indices. Only available on fields, not properties.
		/// </summary>
		public List<DatabaseIndexInfo> UsedByIndices;

		/// <summary>
		/// Adds an index to the usedByIndices set. Does not check if it was already in there.
		/// </summary>
		/// <param name="index"></param>
		public void AddIndex(DatabaseIndexInfo index)
		{
			if (UsedByIndices == null)
			{
				UsedByIndices = new List<DatabaseIndexInfo>();
			}

			UsedByIndices.Add(index);
		}

		/// <summary>
		/// Gets the "local"
		/// </summary>
		/// <param name="relativeTo"></param>
		/// <returns></returns>
		public ContentField GetIdFieldIfMappingNotRequired(ContentFields relativeTo)
		{

			// Do we need to map? Often yes, but occasionally not necessary.
			// We don't if the target type has a virtual field of the source type, where the virtual field name is simply the same as the instance type
			return VirtualInfo.Service.GetContentFields().GetVirtualField(relativeTo.InstanceType, relativeTo.InstanceType.Name);

		}

		/// <summary>
		/// Gets the mapping service for a virtual list field. Can be null if one isn't actually necessary.
		/// </summary>
		/// <returns></returns>
		public async ValueTask<MappingInfo> GetOptionalMappingService(ContentFields relativeTo)
		{
			var fieldOfType = GetIdFieldIfMappingNotRequired(relativeTo);

			if (fieldOfType != null)
			{
				// No mapping needed - the mapping is instead to use this virtual field.
				return new MappingInfo {
					Service = null,
					TargetField = fieldOfType,
					TargetFieldName = fieldOfType.VirtualInfo.IdSource.Name
				};
			}

			var mappingService = await GetMappingService(relativeTo);

			// We need to know what the target field is as we'll need a collector on it.
			var mappingContentFields = mappingService.GetContentFields();

			// Try to get target field (e.g. TagId):
			if (!mappingContentFields.TryGetValue("targetid", out ContentField targetField))
			{
				throw new Exception("Couldn't find target field on a mapping type. This indicates an issue with the mapping engine rather than your usage.");
			}

			return new MappingInfo
			{
				Service = mappingService,
				TargetField = targetField,
				TargetFieldName = targetField.Name
			};
		}

		/// <summary>
		/// Gets a mapping service but doesn't consider if it is optional.
		/// It would be optional if the mapped from type has an ID field that relates to the mapped to type.
		/// </summary>
		/// <param name="relativeTo"></param>
		/// <returns></returns>
		public async ValueTask<AutoService> GetMappingService(ContentFields relativeTo)
		{
			var svc = VirtualInfo.Service;
			return await MappingTypeEngine.GetOrGenerate(relativeTo.Service, svc, VirtualInfo.FieldName);
		}

		/// <summary>
		/// </summary>
		public ContentField(FieldInfo info){
			FieldInfo = info;
		}
		
		/// <summary>
		/// </summary>
		public ContentField(PropertyInfo info){
			PropertyInfo = info;
		}

		/// <summary>
		/// Virtual field.
		/// </summary>
		public ContentField(VirtualInfo info)
		{
			VirtualInfo = info;
		}

		/// <summary>
		/// True if this field is highspeed indexable - either it's used by a virtual field 
		/// (the index is the map for that vfield), or it's e.g. the Id field.
		/// </summary>
		public bool IsIndexable
		{
			get
			{
				return UsedByIndices != null || UsedByVirtual != null;
			}
		}

		/// <summary>
		/// Field name
		/// </summary>
		public string Name
		{
			get {
				if (FieldInfo != null)
				{
					return FieldInfo.Name;
				}

				if (PropertyInfo != null)
				{
					return PropertyInfo.Name;
				}

				return VirtualInfo.FieldName;
			}
		}

		/// <summary>
		/// Field value type
		/// </summary>
		public Type FieldType
		{
			get
			{
				if (FieldInfo != null)
				{
					return FieldInfo.FieldType;
				}

				if (PropertyInfo != null)
				{
					return PropertyInfo.PropertyType;
				}

				// Unavailable on virt fields.
				return null;
			}
		}
	}


	/// <summary>
	/// Meta about a particular map to use (in reverse, target->source)
	/// </summary>
	public struct ReverseMappingInfo
	{
		/// <summary>
		/// The service. Will always exist.
		/// </summary>
		public AutoService Service;
		/// <summary>
		/// The source ID field.
		/// </summary>
		public ContentField SourceField;
	}
	
	/// <summary>
	/// Meta about a particular map to use.
	/// </summary>
	public struct MappingInfo
	{
		/// <summary>
		/// The service, if there is one. This is a MappingService.
		/// </summary>
		public AutoService Service;
		/// <summary>
		/// The target ID field.
		/// </summary>
		public ContentField TargetField;
		/// <summary>
		/// The name of the target field.
		/// </summary>
		public string TargetFieldName;
	}

	/// <summary>
	/// 
	/// </summary>
	public class VirtualInfo
	{
		/// <summary>
		/// The effective name of the field.
		/// </summary>
		public string FieldName;

		/// <summary>
		/// Exists if this is an explicit ListAs field. This is the set of source types for which the ListAs * is implicit.
		/// </summary>
		public List<Type> ImplicitTypes;

		/// <summary>
		/// Don't use this ListAs field in an * if it is explicit, and the source type is not in the ImplicitTypes set.
		/// </summary>
		public bool IsExplicit
		{
			get {
				return ImplicitTypes != null;
			}
		}

		/// <summary>
		/// Usually a one-off to establish if this ListAs field is implicit for the given source type.
		/// </summary>
		/// <param name="type"></param>
		/// <returns></returns>
		public bool IsImplicitFor(Type type)
		{
			return ImplicitTypes != null && ImplicitTypes.Contains(type);
		}

		/// <summary>
		/// The meta="title" field for this listAs field. Used for searching through them.
		/// </summary>
		public ContentField MetaTitleField;

		/// <summary>
		/// True if list
		/// </summary>
		public bool IsList;

		/// <summary>
		/// The type of the content in this field. T[] indicates an array.
		/// </summary>
		public Type FieldType;

		/// <summary>
		/// Set only if Type is not null.
		/// </summary>
		public AutoService _service;

		/// <summary>
		/// The type that the ID is for. Must be provided.
		/// </summary>
		public Type Type;

		/// <summary>
		/// The field on the class that the ID of the optional object comes from.
		/// </summary>
		public string IdSourceField;

		/// <summary>
		/// Resolved ID source field.
		/// </summary>
		public ContentField IdSource;

		/// <summary>
		/// The service for the type (if there is a type).
		/// </summary>
		public AutoService Service {
			get {
				if (_service != null)
				{
					return _service;
				}

				_service = Services.GetByContentType(Type);
				return _service;
			}
		}

	}

}