---
name: nuxt-ui
description: Reference for Nuxt UI v4 component APIs. Load this when writing Vue templates that use Nuxt UI components (prefixed with U). Provides correct props, slots, and events for all 125+ components.
user-invocable: false
---

# Nuxt UI v4 Component Reference

Current as of **v4.10.0** (July 2026). Nuxt UI v4 is fully free and open-source (MIT). All components use the `U` prefix (e.g., `UButton`). Icons use Iconify format: `i-lucide-{name}`.

Authoritative live docs per component: `https://ui.nuxt.com/raw/docs/components/<kebab-name>.md` (full resolved props/slots/emits + theme). Index of all pages: `https://ui.nuxt.com/llms.txt`. If this file disagrees with the live docs or the installed version's types, trust those.

Common patterns across all components:
- `as` prop changes the rendered element/component
- `ui` prop accepts an object for Tailwind class overrides per slot; a slot's value may also be a function `(defaultClasses) => classes` to replace the defaults instead of merging
- Colors: `"primary" | "secondary" | "success" | "info" | "warning" | "error" | "neutral"`
- Sizes: `"xs" | "sm" | "md" | "lg" | "xl"` (some components have more)
- Variants vary per component but common ones: `"solid" | "outline" | "soft" | "subtle"`
- Icon props (`icon`, `trailingIcon`, …) accept `false` to hide a default icon

---

## Layout Components

### App
Wraps the entire application. Required for Toast and Tooltip to work.
- Props: `toaster` (object: position, duration, max, expand), `tooltip` (object: delayDuration, etc.), `locale`, `portal` ("body"), `scrollBody`, `nonce`, `ui`
- Slots: `default`

### Container
Centers and constrains content width (controlled by `--ui-container` CSS variable).
- Props: `as`, `ui`
- Slots: `default`

### Theme
Provides theme overrides to all descendant components without rendering any DOM element. Uses provide/inject.
- Props: `ui` (object — keys are camelCase component names, values are slot class overrides, e.g. `{ button: { base: 'rounded-full' } }`), `props` (object — override default prop values for all descendant components, e.g. `{ button: { size: 'lg' } }`)
- Slots: `default`
- Notes: individual component `ui` props take precedence; nestable (inner overrides win)

### Sidebar
Generic collapsible sidebar (standalone; distinct from DashboardSidebar).
- Props: `variant` ("sidebar"|"floating"|"inset", default "sidebar"), `collapsible` ("offcanvas"|"icon"|"none", default "offcanvas"), `side` ("left"|"right", default "left"), `title`, `description`, `close` (boolean|ButtonProps, default false), `closeIcon`, `rail` (boolean, default false), `transition` (true), `mode` ("slideover"), `menu`, `open` (true), `ui`
- Slots: `header`, `title`, `description`, `actions`, `close`, `default`, `footer`, `rail`, `content`
- v-model: `open`

---

## Element Components

### Alert
- Props: `title`, `description`, `icon`, `avatar`, `color`, `variant` ("solid"|"outline"|"soft"|"subtle"), `orientation` ("vertical"|"horizontal"), `actions` (ButtonProps[]), `close` (boolean|ButtonProps), `closeIcon`, `ui`
- Slots: `leading`, `title`, `description`, `actions`, `close`
- Events: `update:open`

### Avatar
- Props: `src`, `alt`, `icon`, `text`, `size` ("3xs".."3xl", default "md"), `color`, `chip` (boolean|ChipProps), `ui` (native img attributes pass through)
- No slots or events

### AvatarGroup
- Props: `size` ("3xs".."3xl"), `color`, `max` (string|number), `ui`
- Slots: `default`

### Badge
- Props: `label` (string|number), `color`, `variant` ("solid"|"outline"|"soft"|"subtle"), `size`, `square`, `icon`, `avatar`, `leading`, `leadingIcon`, `trailing`, `trailingIcon`, `ui`
- Slots: `leading`, `default`, `trailing`

### Banner
- Props: `id`, `icon`, `title`, `actions` (ButtonProps[]), `to`, `target`, `color`, `close` (boolean|ButtonProps, default false), `closeIcon`, `ui`
- Slots: `leading`, `title`, `actions`, `close`
- Events: `close`

### Button
- Props: `label`, `color` (default "primary"), `variant` ("solid"|"outline"|"soft"|"subtle"|"ghost"|"link", default "solid"), `size` (default "md"), `square`, `block`, `icon`, `leading`, `leadingIcon`, `trailing`, `trailingIcon`, `avatar`, `loading`, `loadingAuto`, `loadingIcon`, `active`, `activeColor`, `activeVariant`, `activeClass`, `inactiveClass`, `to`, `href`, `target`, `replace`, `external`, `rel`, `prefetch`, `type` ("button"|"submit"|"reset", default "button"), `disabled`, `as`, `ui`
- Slots: `leading`, `default`, `trailing`
- Events: `click` (supports Promise for loadingAuto)

### Calendar
- Props: `type` ("date"|"month"|"year", default "date"), `color`, `variant` ("solid"|"outline"|"soft"|"subtle"), `size`, `range`, `multiple`, `monthControls` (true), `yearControls` (true), `viewControl` (clickable heading cycles date→month→year views), `prevMonth`/`nextMonth`/`prevYear`/`nextYear` (ButtonProps) + `*Icon` variants, `weekNumbers`, `fixedWeeks` (true), `numberOfMonths`, `weekStartsOn`, `locale`, `maximumDays`, `preventDeselect`, `disabled`, `readonly`, `modelValue`, `defaultValue`, `placeholder`, `minValue`, `maxValue`, `isDateDisabled`, `isDateUnavailable`, `isDateHighlightable`, `ui`
- Slots: `heading`, `day`, `week-day`, `month-cell`, `year-cell`
- Events: `update:modelValue`, `update:placeholder`

### Card
- Props: `title`, `description`, `variant` ("solid"|"outline"|"soft"|"subtle", default "outline"), `ui` (root, header, body, footer)
- Slots: `header`, `title`, `description`, `default` (body), `footer`

### Chip
- Props: `text` (string|number), `color`, `size` ("3xs".."3xl"), `position` ("top-right"|"bottom-right"|"top-left"|"bottom-left", default "top-right"), `inset`, `standalone`, `show` (true), `ui`
- Slots: `default`, `content`
- Events: `update:show`

### Collapsible
- Props: `disabled`, `defaultOpen`, `open`, `unmountOnHide` (true), `ui`
- Slots: `default` (trigger), `content`
- Events: `update:open`

### FieldGroup
- Props: `size`, `orientation` ("horizontal"|"vertical", default "horizontal"), `ui`
- Slots: `default`

### Icon
- Props: `name` (required, Iconify name or Vue component), `mode` ("svg"|"css"), `size` (string|number), `customize` (function to customize the SVG)

### Kbd
- Props: `value`, `color` (default "neutral"), `variant` ("solid"|"soft"|"subtle"|"outline", default "outline"), `size` ("sm"|"md"|"lg", default "md"), `ui`
- Slots: `default`

### Progress
- Props: `modelValue` (number|null), `max`, `status`, `inverted`, `size` ("2xs".."2xl"), `color`, `orientation` ("horizontal"|"vertical"), `animation` ("carousel"|"carousel-inverse"|"swing"|"elastic"), `ui`
- Slots: `status`
- Events: `update:modelValue`, `update:max`

### Separator
- Props: `label`, `icon`, `avatar`, `color`, `size` (default "xs"), `type` ("solid"|"dashed"|"dotted", default "solid"), `orientation` ("horizontal"|"vertical"), `position` ("start"|"center"|"end"), `decorative`, `ui`
- Slots: `default`

### Skeleton
- Props: `as`, `ui`
- Slots: `default`

---

## Form Components

### Checkbox
- Props: `modelValue` (boolean|"indeterminate"), `trueValue`/`falseValue` (custom checked/unchecked values), `label`, `description`, `color`, `variant` ("card"|"list"), `size`, `indicator` ("start"|"end"|"hidden"), `icon` (default "i-lucide-check"), `indeterminateIcon`, `highlight`, `disabled`, `required`, `name`, `id`
- Slots: `label`, `description`
- Events: `change`, `update:modelValue`

### CheckboxGroup
- Props: `modelValue` (any[]), `items`, `legend`, `valueKey` ("value"), `labelKey` ("label"), `descriptionKey` ("description"), `size`, `variant` ("table"|"list"|"card"), `orientation` ("horizontal"|"vertical"), `color`, `icon`, `indicator`, `highlight`, `disabled`, `required`, `name`, `loop`
- Slots: `legend`, `label`, `description`
- Events: `update:modelValue`, `change`

### ColorPicker
- Props: `modelValue` (string), `defaultValue` ("#FFFFFF"), `format` ("hex"|"rgb"|"hsl"|"cmyk"|"lab"), `size`, `throttle` (50), `disabled`
- Events: `update:modelValue`

### FileUpload
- Props: `modelValue` (File|File[]|null), `accept` ("*"), `multiple`, `label`, `description`, `variant` ("button"|"area"), `size`, `color`, `layout` ("list"|"grid"), `position` ("inside"|"outside"), `highlight`, `reset`, `dropzone` (true), `interactive` (true), `disabled`, `required`, `preview` (true), `fileDelete` (boolean|ButtonProps, true), `fileDeleteIcon`, `fileIcon`, `fileImage`, `icon`, `name`, `id`
- Slots: `default`, `leading`, `label`, `description`, `actions`, `files`, `files-top`, `files-bottom`, `file`, `file-leading`, `file-name`, `file-size`, `file-trailing`
- Events: `change`, `update:modelValue`
- Exposed: `inputRef`, `dropzoneRef`

### Form
- Props: `state` (object), `schema`, `validate`, `validateOn` (("input"|"change"|"blur")[]), `validateOnInputDelay` (300), `disabled`, `transform` (true), `nested`, `loadingAuto` (true), `name`, `id`
- Slots: `default`
- Events: `submit` (FormSubmitEvent), `error` (FormErrorEvent)
- Exposed: `submit()`, `validate()`, `clear()`, `getErrors()`, `setErrors()`, `errors`, `disabled`, `dirty`, `dirtyFields`, `touchedFields`, `blurredFields`

### FormField
- Props: `name`, `errorPattern`, `label`, `description`, `help`, `error` (string|boolean), `hint`, `size`, `required`, `eagerValidation`, `validateOnInputDelay`, `orientation` ("vertical"|"horizontal"), `ui`
- Slots: `label`, `hint`, `description`, `help`, `error`, `default`

### Input
- Props: `type` (default "text"), `placeholder`, `color`, `variant` ("outline"|"soft"|"subtle"|"ghost"|"none"), `size`, `icon`, `avatar`, `leading`, `leadingIcon`, `trailing`, `trailingIcon`, `loading`, `loadingIcon`, `highlight`, `fixed` (keep mobile text size on all breakpoints), `modelValue`, `defaultValue`, `disabled`, `required`, `autocomplete` ("off"), `autofocus`, `autofocusDelay`, `id`, `name`, `ui`
- Slots: `leading`, `default`, `trailing`
- Events: `update:modelValue`, `blur`, `change`
- Exposed: `inputRef`

### InputDate
- Props: `modelValue`, `placeholder`, `defaultPlaceholder`, `range`, `size`, `color`, `variant`, `highlight`, `icon`, `leadingIcon`, `trailingIcon`, `separatorIcon`, `loading`, `loadingIcon`, `locale`, `hourCycle`, `step`, `granularity`, `hideTimeZone`, `minValue`, `maxValue`, `isDateUnavailable`, `disabled`, `readonly`, `required`, `autofocus`, `name`, `id`
- Slots: `leading`, `default`, `trailing`, `separator`
- Events: `update:modelValue`, `update:placeholder`, `change`, `blur`, `focus`

### InputMenu
- Props: `modelValue`, `items`, `multiple`, `mode` ("combobox"|"autocomplete", default "combobox"), `valueKey` ("value"), `labelKey` ("label"), `searchTerm` (""), `placeholder`, `size`, `color`, `variant`, `icon`, `leadingIcon`, `trailingIcon`, `selectedIcon`, `deleteIcon`, `clearIcon`, `clear`, `open`, `defaultOpen`, `disabled`, `highlight`, `highlightOnHover`, `openOnClick`, `openOnFocus`, `resetSearchTermOnBlur` (true), `resetSearchTermOnSelect` (true), `resetModelValueOnClear` (true), `createItem`, `filterFields`, `ignoreFilter`, `virtualize`, `portal` (true), `name`, `id`
- Note: `autocomplete` is the native HTML autofill attribute here (e.g. "one-time-code"); the old boolean autocomplete behavior became `mode` in v4.8
- Slots: `leading`, `trailing`, `empty`, `item`, `item-leading`, `item-label`, `item-description`, `item-trailing`, `tags-item-text`, `tags-item-delete`, `content-top`, `content-bottom`, `create-item-label`
- Events: `update:modelValue`, `update:searchTerm`, `update:open`, `change`, `blur`, `focus`, `create`, `clear`, `highlight`, `remove-tag`
- Exposed: `inputRef`, `viewportRef`

### InputNumber
- Props: `modelValue` (number|null), `placeholder`, `min`, `max`, `step`, `stepSnapping`, `size`, `color`, `variant` ("outline"), `orientation` ("horizontal"|"vertical"), `highlight`, `increment` (boolean|ButtonProps, true), `incrementIcon`, `incrementDisabled`, `decrement` (boolean|ButtonProps, true), `decrementIcon`, `decrementDisabled`, `disableWheelChange`, `invertWheelChange`, `focusOnChange`, `locale`, `disabled`, `required`, `readonly`, `formatOptions` (Intl.NumberFormatOptions), `autofocus`, `name`, `id`
- Slots: `increment`, `decrement`
- Events: `update:modelValue`, `change`, `blur`
- Exposed: `inputRef`

### InputRating
- Props: `modelValue` (number), `defaultValue` (0), `length` (5), `step` (1, use 0.5 for half-steps), `icon`, `emptyIcon`, `color`, `size`, `orientation` ("horizontal"), `clearable`, `hoverable`, `readonly`, `disabled`, `required`, `name`, `id`, `ui`
- Slots: `item`
- Events: `update:modelValue`, `change`

### InputTags
- Props: `modelValue` (T[]), `placeholder`, `maxLength`, `color`, `variant`, `size`, `autofocus`, `deleteIcon`, `highlight`, `addOnPaste`, `addOnTab`, `addOnBlur`, `duplicate`, `disabled`, `delimiter`, `max`, `convertValue`, `displayValue`, `name`, `required`, `icon`, `avatar`, `leading`, `leadingIcon`, `trailing`, `trailingIcon`, `loading`, `loadingIcon`
- Slots: `leading`, `default`, `trailing`, `item-text`, `item-delete`
- Events: `change`, `blur`, `focus`, `update:modelValue`, `invalid`, `addTag`, `removeTag`

### InputTime
- Props: `modelValue`, `range`, `color`, `variant` ("outline"), `size`, `highlight`, `autofocus`, `hourCycle`, `step`, `stepSnapping`, `granularity` ("hour"|"minute"|"second"), `hideTimeZone`, `maxValue`, `minValue`, `isTimeUnavailable`, `separatorIcon`, `locale`, `disabled`, `readonly`, `name`, `required`, `icon`, `leading`, `leadingIcon`, `trailing`, `trailingIcon`, `loading`, `loadingIcon`
- Slots: `leading`, `default`, `trailing`, `separator`
- Events: `blur`, `change`, `focus`, `update:modelValue`, `update:placeholder`

### Listbox
Selectable list of items with built-in search, virtualization, and rich item rendering (like SelectMenu without the popover).
- Props: `items`, `modelValue`, `defaultValue`, `multiple`, `valueKey`, `labelKey` ("label"), `descriptionKey` ("description"), `color`, `size`, `filter` (false), `filterFields`, `ignoreFilter`, `searchTerm`, `selectedIcon`, `virtualize` (false), `highlight`, `highlightOnHover` (true), `loading`, `loadingIcon`, `orientation`, `selectionBehavior`, `autofocus`, `disabled`, `required`, `name`, `id`, `ui`
- Slots: `loading`, `empty`, `item`, `item-leading`, `item-label`, `item-description`, `item-trailing`
- Events: `update:modelValue`, `update:searchTerm`, `change`, `highlight`

### PinInput
- Props: `modelValue`, `color`, `variant` ("outline"), `size`, `length` (5), `separator` (character between inputs), `autofocus`, `highlight`, `disabled`, `mask`, `otp`, `placeholder`, `required`, `type` ("text")
- Slots: `separator`
- Events: `update:modelValue`, `complete`, `change`, `blur`

### RadioGroup
- Props: `modelValue`, `items`, `legend`, `valueKey` ("value"), `labelKey` ("label"), `descriptionKey` ("description"), `size`, `variant` ("card"|"list"|"table"), `color`, `orientation` ("horizontal"|"vertical"), `indicator` ("start"|"end"|"hidden"), `highlight`, `disabled`, `loop`, `name`, `required`
- Slots: `legend`, `label`, `description`
- Events: `update:modelValue`, `change`

### Select
- Props: `modelValue`, `items`, `multiple`, `valueKey` ("value"), `labelKey` ("label"), `descriptionKey` ("description"), `placeholder`, `color`, `variant` ("outline"|"soft"|"subtle"|"ghost"|"none"), `size`, `icon`, `leadingIcon`, `trailingIcon` (chevron-down), `selectedIcon` (check), `avatar`, `leading`, `trailing`, `loading`, `loadingIcon`, `highlight`, `nullableValue` (value used when selection is cleared), `content`, `arrow`, `portal` (true), `open`, `defaultOpen`, `disabled`, `autofocus`, `name`, `id`, `form`, `required`, `autocomplete`, `ui`
- Slots: `leading`, `default`, `trailing`, `item`, `item-leading`, `item-label`, `item-description`, `item-trailing`, `content-top`, `content-bottom`
- Events: `update:modelValue`, `update:open`, `change`, `blur`, `focus`
- Exposed: `triggerRef`, `viewportRef`

### SelectMenu
- Props: same as Select (minus `nullableValue`) plus `searchInput` (boolean|InputProps, true), `clear`, `clearIcon`, `createItem`, `filterFields`, `ignoreFilter`, `virtualize`, `portal` (true), `highlightOnHover`, `resetSearchTermOnBlur` (true), `resetSearchTermOnSelect` (true), `resetModelValueOnClear` (true), `searchTerm` (""), `autofocus`, `autofocusDelay`
- Slots: same as Select plus `empty`, `create-item-label`
- Events: same as Select plus `update:searchTerm`, `create`, `clear`, `highlight`

### Slider
- Props: `modelValue` (number|number[]), `color`, `size`, `orientation`, `tooltip` (boolean|TooltipProps), `min` (0), `max` (100), `step` (1), `minStepsBetweenThumbs`, `disabled`, `inverted`, `name`
- Events: `change`, `update:modelValue`

### Switch
- Props: `modelValue` (boolean), `trueValue`/`falseValue` (custom checked/unchecked values), `color`, `size`, `loading`, `loadingIcon`, `checkedIcon`, `uncheckedIcon`, `label`, `description`, `highlight`, `disabled`, `value`, `id`, `name`, `required`
- Slots: `label`, `description`
- Events: `update:modelValue`, `change`

### Textarea
- Props: `modelValue`, `placeholder`, `rows` (3), `maxrows` (0), `autoresize`, `autofocus`, `autofocusDelay`, `autoresizeDelay`, `color`, `variant`, `size`, `highlight`, `disabled`, `required`, `icon`, `leading`, `leadingIcon`, `trailing`, `trailingIcon`, `loading`, `loadingIcon`, `avatar`, `id`, `name`, `autocomplete`
- Slots: `leading`, `default`, `trailing`
- Events: `update:modelValue`, `blur`, `change`
- Exposed: `textareaRef`, `autoResize()`

---

## Data Components

### Accordion
- Props: `items` (T[]), `type` ("single"|"multiple", default "single"), `collapsible` (true), `modelValue`, `defaultValue`, `valueKey` ("value"), `labelKey` ("label"), `trailingIcon`, `disabled`, `unmountOnHide` (true), `ui`
- Item properties: `label`, `icon`, `trailingIcon`, `content`, `value`, `disabled`, `slot`
- Slots: `leading`, `default`, `trailing`, `content`, `body`, `#{{ item.slot }}`, `#{{ item.slot }}-body`
- Events: `update:modelValue`

### Carousel
- Props: `items` (T[]), `arrows`, `dots`, `orientation` ("horizontal"|"vertical"), `prev` (ButtonProps), `prevIcon`, `next` (ButtonProps), `nextIcon`, `align`, `containScroll`, `slidesToScroll` (1), `dragFree`, `loop`, `duration` (25), `startIndex` (0), `active` (true), `autoplay`, `autoScroll`, `autoHeight`, `fade`, `wheelGestures`, `breakpoints`, `ui`
- Slots: `default`
- Events: `select`
- Exposed: `emblaRef`, `emblaApi`

### Empty
- Props: `icon`, `avatar`, `title`, `description`, `actions` (ButtonProps[]), `variant` ("outline"|"solid"|"soft"|"subtle"|"naked"), `size`, `loading`, `loadingIcon`, `ui`
- Slots: `header`, `leading`, `title`, `description`, `body`, `actions`, `footer`

### Marquee
- Props: `pauseOnHover`, `reverse`, `orientation` ("horizontal"|"vertical"), `repeat` (4), `overlay` (true), `ui`
- Slots: `default`

### ScrollArea
- Props: `orientation` ("vertical"|"horizontal"), `items` (T[]), `virtualize` (boolean|options, incl. `getScrollElement`), `shadow` (scroll-edge shadows), `ui`
- Slots: `default` (receives { item, index } when using items)
- Events: `scroll`
- Exposed: `$el`, `virtualizer`

### Table
- Props: `data` (T[]), `columns` (TableColumn[]), `sticky` (boolean|"header"|"footer"), `virtualize`, `empty` (string), `caption`, `globalFilter`, `columnFilters`, `sorting`, `pagination`, `rowSelection`, `expanded`, `columnVisibility`, `columnPinning`, `loading`, `loadingColor`, `loadingAnimation`, `ui` — plus TanStack Table options passed through (`state`, `initialState`, `getRowId`, `getSubRows`, `meta`, `defaultColumn`, `sortingOptions`, `paginationOptions`, …)
- Row interaction via callback props (not emits): `onSelect(e, row)`, `onHover(e, row|null)`, `onContextmenu(e, row)`
- Slots: `#expanded`, `#empty`, `#loading`, `#caption`, `#body-top`, `#body-bottom`, `#[columnId]-header`, `#[columnId]-cell`
- Exposed: `tableRef`, `tableApi` (TanStack Table instance)

### Timeline
- Props: `items` (T[]), `size` ("3xs".."3xl"), `color`, `orientation` ("horizontal"|"vertical"), `valueKey` ("value"), `modelValue`, `defaultValue`, `reverse`, `ui`
- Item properties: `date`, `title`, `description`, `icon`, `avatar`, `value`, `slot`
- Slots: `#indicator`, `#wrapper`, `#date`, `#title`, `#description`, `#{{ item.slot }}-indicator/date/title/description`
- Events: `select`, `update:modelValue`

### Tree
- Props: `items`, `color`, `size`, `modelValue`, `defaultValue`, `multiple`, `getKey`, `labelKey` ("label"), `trailingIcon`, `expandedIcon`, `collapsedIcon`, `nested` (true), `virtualize`, `expanded`, `defaultExpanded`, `selectionBehavior` ("replace"|"toggle"), `propagateSelect`, `bubbleSelect`, `disabled`, `ui`
- Select/toggle via callback props (not emits): `onSelect(e, item)`, `onToggle(e, item)`
- Slots: `item-wrapper`, `item`, `item-leading`, `item-label`, `item-trailing`
- Events: `update:modelValue`, `update:expanded`

### User
- Props: `name`, `description`, `avatar` (AvatarProps), `chip` (boolean|ChipProps), `size` ("3xs".."3xl"), `orientation` ("horizontal"|"vertical"), `to`, `target`, `onClick`, `ui`
- Slots: `avatar`, `name`, `description`, `default`

---

## Navigation Components

### Breadcrumb
- Props: `items` (T[]), `color`, `separatorIcon` (default "i-lucide-chevron-right"), `labelKey` ("label"), `ui`
- Item properties: `label`, `icon`, `avatar`, `slot`, `to`, `target`
- Slots: `#item`, `#item-leading`, `#item-label`, `#item-trailing`, `#separator`, `#{{ item.slot }}`

### CommandPalette
- Props: `size`, `icon` ("i-lucide-search"), `trailingIcon`, `selectedIcon`, `childrenIcon`, `placeholder`, `autofocus` (true), `close`, `closeIcon`, `back` (true), `backIcon`, `input` (boolean|InputProps, true), `groups` (CommandPaletteGroup[]), `fuse`, `virtualize`, `valueKey`, `labelKey` ("label"), `descriptionKey` ("description"), `preserveGroupOrder`, `multiple`, `disabled`, `modelValue`, `defaultValue`, `highlightOnHover` (true), `selectionBehavior`, `loading`, `loadingIcon`, `searchTerm` (""), `searchDelay` (debounce ms), `ui`
- Slots: `#empty`, `#footer`, `#back`, `#close`, `#item`, `#item-leading`, `#item-label`, `#item-description`, `#item-trailing`, `#group-label`
- Events: `update:modelValue`, `highlight`, `update:open`, `update:searchTerm`

### Link
- Props: `to`, `href`, `target`, `rel`, `external`, `prefetch`, `active`, `exact`, `exactQuery`, `exactHash`, `activeClass`, `inactiveClass`, `disabled`, `type` ("button"|"submit"|"reset"), `as`, `replace`, `locale`
- Note: auto-localizes internal `to` routes when `@nuxtjs/i18n` is installed (also applies to components accepting `to`: NavigationMenu, Breadcrumb, DropdownMenu, CommandPalette)
- Slots: `default`

### NavigationMenu
- Props: `type` ("single"|"multiple", default "multiple"), `modelValue`, `items`, `color`, `variant` ("pill"|"link"), `orientation` ("horizontal"|"vertical"), `collapsed`, `tooltip`, `popover`, `highlight`, `highlightColor`, `content`, `contentOrientation`, `arrow`, `trailingIcon`, `externalIcon`, `valueKey` ("value"), `labelKey` ("label"), `delayDuration` (0), `disableClickTrigger`, `disableHoverTrigger`, `unmountOnHide` (true), `disabled`, `collapsible` (true), `ui`
- Slots: `#item`, `#item-leading`, `#item-label`, `#item-trailing`, `#item-content`, `#list-leading`, `#list-trailing`, `#{{ item.slot }}`
- Events: `update:modelValue`

### Pagination
- Props: `page`, `defaultPage`, `total` (0), `itemsPerPage` (10), `siblingCount` (2), `showEdges`, `showControls` (true), `firstIcon`, `prevIcon`, `nextIcon`, `lastIcon`, `ellipsisIcon`, `color` ("neutral"), `variant` ("outline"), `activeColor` ("primary"), `activeVariant` ("solid"), `size`, `to`, `disabled`, `ui`
- Slots: `#first`, `#prev`, `#next`, `#last`, `#ellipsis`, `#item`
- Events: `update:page`

### Stepper
- Props: `items` (T[]), `size`, `color`, `orientation` ("horizontal"|"vertical"), `valueKey` ("value"), `defaultValue`, `disabled`, `linear` (true), `modelValue`, `ui`
- Item properties: `title`, `description`, `content`, `icon`, `value`, `disabled`, `slot`
- Slots: `#indicator`, `#wrapper`, `#title`, `#description`, `#content`, `#{{ item.slot }}`
- Events: `next`, `prev`, `update:modelValue`
- Exposed: `next()`, `prev()`, `hasNext`, `hasPrev`

### Tabs
- Props: `items` (T[]), `color`, `variant` ("pill"|"link"), `size`, `orientation` ("horizontal"|"vertical"), `content` (true), `valueKey` ("value"), `labelKey` ("label"), `defaultValue`, `modelValue`, `activationMode` ("automatic"|"manual"), `unmountOnHide` (true), `ui`
- Slots: `#leading`, `#default`, `#trailing`, `#content`, `#list-leading`, `#list-trailing`
- Events: `update:modelValue`
- Exposed: `triggersRef`

---

## Overlay Components

### ContextMenu
- Props: `size`, `items` (ContextMenuItem[]|ContextMenuItem[][]), `checkedIcon`, `loadingIcon`, `externalIcon`, `content`, `portal` (true), `labelKey` ("label"), `descriptionKey` ("description"), `pressOpenDelay` (long-press ms on touch), `disabled`, `modal` (true), `ui`
- Slots: `default`, `item`, `item-leading`, `item-label`, `item-description`, `item-trailing`, `content-top`, `content-bottom`
- Events: `update:open`

### Drawer
- Props: `title`, `description`, `inset`, `content`, `overlay` (true), `handle` (true), `handleOnly` (drag only via handle), `portal` (true), `nested`, `modal` (true), `open`, `direction` ("top"|"bottom"|"left"|"right", default "bottom"), `dismissible` (true), `defaultOpen`, `close` (boolean|ButtonProps), `closeIcon`, `snapPoints`, `activeSnapPoint`, `shouldScaleBackground`, `ui`
- Slots: `default` (trigger), `content`, `header`, `title`, `description`, `actions`, `close`, `body`, `footer`
- Events: `update:open`, `close`, `drag`, `close:prevent`, `release`, `update:activeSnapPoint`, `animationEnd`

### DropdownMenu
- Props: `size`, `items` (DropdownMenuItem[]|DropdownMenuItem[][]), `checkedIcon`, `loadingIcon`, `externalIcon`, `content`, `arrow`, `portal` (true), `labelKey` ("label"), `descriptionKey` ("description"), `filter` (searchable menu), `filterFields`, `ignoreFilter`, `searchTerm`, `disabled`, `defaultOpen`, `open`, `modal` (true), `ui`
- Slots: `default` (trigger), `empty`, `item`, `item-leading`, `item-label`, `item-description`, `item-trailing`, `content-top`, `content-bottom`
- Events: `update:open`, `update:searchTerm`

### Modal
- Props: `title`, `description`, `content`, `overlay` (true), `scrollable`, `transition` (true), `fullscreen`, `portal` (true), `close` (boolean|ButtonProps, true), `closeIcon`, `dismissible` (true), `unmountOnHide` (true; set false to keep content mounted while closed, preserving form state/scroll), `open`, `defaultOpen`, `modal` (true), `ui`
- Slots: `default` (trigger), `content`, `header`, `title`, `description`, `actions`, `close`, `body`, `footer`
- Events: `update:open`, `close:prevent`, `after:enter`, `after:leave`, `enter`, `leave`

### Popover
- Props: `mode` ("click"|"hover", default "click"), `content`, `arrow`, `portal` (true), `reference`, `dismissible` (true), `enableTouch` (hover mode on touch devices), `defaultOpen`, `open`, `modal`, `openDelay` (0), `closeDelay` (0), `ui`
- Slots: `default` (trigger), `content` (exposes `close` in click mode), `anchor`
- Events: `close:prevent`, `update:open`

### Slideover
- Props: `title`, `description`, `content`, `overlay` (true), `transition` (true), `side` ("right"|"top"|"bottom"|"left", default "right"), `inset`, `portal` (true), `close` (boolean|ButtonProps, true), `closeIcon`, `dismissible` (true), `unmountOnHide` (true), `open`, `defaultOpen`, `modal` (true), `ui`
- Slots: `default` (trigger), `content`, `header`, `title`, `description`, `actions`, `close`, `body`, `footer`
- Events: `update:open`, `close:prevent`, `after:enter`, `after:leave`, `enter`, `leave`

### Toast (via useToast composable)
```ts
const toast = useToast()
toast.add({ title, description, icon, color, actions, duration, close, progress })
```
- Props: `title`, `description`, `icon`, `avatar`, `color`, `orientation` ("vertical"|"horizontal"), `close` (true), `closeIcon`, `actions` (ButtonProps[]), `progress` (boolean|ProgressProps, true), `duration` (ms), `type` ("foreground"|"background"), `ui`
- Global config via App component's `toaster` prop: `{ position, duration, max, expand }`

### Tooltip
- Props: `text`, `kbds` ((string|KbdProps)[]), `content`, `arrow`, `portal` (true), `reference`, `defaultOpen`, `open`, `delayDuration`, `disableHoverableContent`, `disableClosingTrigger`, `disabled`, `ignoreNonKeyboardFocus`, `ui`
- Slots: `default` (trigger), `content`
- Events: `update:open`

---

## Page Components

### Header
Responsive site header with mobile menu.
- Props: `title`, `to` ("/"), `mode` ("modal"|"slideover"|"drawer", default "modal" — mobile menu container), `menu` (props for that container), `toggle` (boolean|ButtonProps, true), `toggleSide` ("left"|"right", default "right"), `autoClose` (true), `open`, `ui`
- Slots: `title`, `left`, `default`, `right`, `toggle`, `top`, `bottom`, `body`, `content`
- Events: `update:open`

### Main
Fills the available viewport height (use around page content, between Header and Footer).
- Props: `as` ("main"), `ui`
- Slots: `default`

### Footer
- Props: `as` ("footer"), `ui`
- Slots: `left`, `default`, `right`, `top`, `bottom`

### FooterColumns
Link columns for the Footer's `top` slot.
- Props: `columns` ({ label, children: { label, to, … }[] }[]), `ui`
- Slots: `left`, `default`, `right`, `column-label`, `link`, `link-leading`, `link-label`, `link-trailing`

### Error
Pre-built error page (NuxtError support).
- Props: `error` (NuxtError-like: statusCode, statusMessage, message), `icon`, `redirect` ("/"), `clear` (boolean|ButtonProps, true), `ui`
- Slots: `default`, `leading`, `statusCode`, `statusMessage`, `message`, `links`

### Page
- Props: `ui` (root, left, center, right)
- Slots: `left`, `default`, `right`

### PageHeader
- Props: `headline`, `title`, `description`, `links` (ButtonProps[]), `ui`
- Slots: `headline`, `title`, `description`, `links`, `default`

### PageHero
- Props: `headline`, `title`, `description`, `links` (ButtonProps[]), `orientation` ("horizontal"|"vertical"), `reverse`, `ui`
- Slots: `top`, `header`, `headline`, `title`, `description`, `body`, `footer`, `links`, `default`, `bottom`

### PageBody
- Props: `ui`
- Slots: `default`

### PageCard
- Props: `icon`, `title`, `description`, `orientation` ("vertical"|"horizontal"), `reverse`, `highlight`, `highlightColor`, `spotlight`, `spotlightColor`, `variant` ("solid"|"outline"|"soft"|"subtle"|"ghost"|"naked", default "outline"), `to`, `target`, `onClick`, `ui`
- Slots: `header`, `body`, `leading`, `title`, `description`, `footer`, `default`

### PageSection
- Props: `headline`, `icon`, `title`, `description`, `links` (ButtonProps[]), `features` (PageFeatureProps[]), `orientation` ("vertical"|"horizontal"), `reverse`, `ui`
- Slots: `top`, `header`, `leading`, `headline`, `title`, `description`, `body`, `features`, `footer`, `links`, `default`, `bottom`

### PageGrid
- Props: `ui`
- Slots: `default`
- Default: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8`

### PageColumns
- Props: `ui`
- Slots: `default`
- Default: `column-1 md:columns-2 lg:columns-3 gap-8 space-y-8`

### PageAside
- Props: `ui`
- Slots: `top`, `default`, `bottom`

### PageAnchors
- Props: `links` (T[]), `ui`
- Link object: `{ label, icon?, ...LinkProps }`
- Slots: `link`, `link-leading`, `link-label`, `link-trailing`

### PageCTA
- Props: `title`, `description`, `orientation` ("vertical"|"horizontal"), `reverse`, `variant` ("outline"|"solid"|"soft"|"subtle"|"naked"), `links` (ButtonProps[]), `ui`
- Slots: `top`, `header`, `title`, `description`, `body`, `footer`, `links`, `default`, `bottom`

### PageFeature
- Props: `icon`, `title`, `description`, `orientation` ("horizontal"|"vertical"), `to`, `target`, `onClick`, `ui`
- Slots: `leading`, `title`, `description`, `default`

### PageLinks
- Props: `title`, `links` (T[]), `ui`
- Link object: `{ label, icon?, ...LinkProps }`
- Slots: `title`, `link`, `link-leading`, `link-label`, `link-trailing`

### PageList
- Props: `divide` (false), `ui`
- Slots: `default`

### PageLogos
- Props: `title`, `items` (string[]|{ src, alt }[]), `marquee` (boolean|MarqueeProps, false), `ui`
- Slots: `default`

---

## Dashboard Components

### DashboardGroup
- Props: `storage` ("cookie"|"local", default "cookie"), `storageKey` ("dashboard"), `storageOptions`, `persistent` (true), `unit` ("%"|"rem"|"px", default "%"), `ui`
- Slots: `default`

### DashboardPanel
- Props: `id`, `minSize` (15), `maxSize`, `defaultSize`, `resizable` (false), `ui`
- Slots: `default`, `header`, `body`, `footer`, `resize-handle`

### DashboardNavbar
- Props: `icon`, `title`, `toggle` (boolean|ButtonProps, true), `toggleSide` ("left"|"right"), `ui`
- Slots: `title`, `leading`, `trailing`, `left`, `default`, `right`, `toggle`

### DashboardSidebar
- Props: `mode` ("slideover"), `menu`, `toggle` (boolean|ButtonProps, true), `toggleSide` ("left"|"right"), `id`, `side` ("left"|"right"), `minSize` (10), `maxSize` (20), `defaultSize` (15), `resizable`, `collapsible`, `collapsedSize` (0), `autoClose` (close mobile menu on navigation), `open`, `collapsed`
- Slots: `header`, `default`, `footer`, `toggle`, `content`, `resize-handle`
- v-model: `open`, `collapsed`

### DashboardSidebarCollapse
- Props: `color` ("neutral"), `variant` ("ghost"), `side` ("left"|"right"), plus ButtonProps
- Events: `click`

### DashboardSidebarToggle
- Props: `color` ("neutral"), `variant` ("ghost"), `side` ("left"|"right"), plus ButtonProps
- Events: `click`

### DashboardSearch
- Props: `size`, `icon`, `placeholder`, `autofocus`, `loading`, `close` (true), `closeIcon`, `shortcut` ("meta_k"), `groups` (CommandPaletteGroup[]), `fuse`, `searchDelay`, `colorMode` (true), `title`, `description`, `overlay`, `transition`, `dismissible`, `fullscreen` (false), `unmountOnHide`, `modal`, `portal`, `open` (false), `searchTerm` (""), `ui`
- Slots: `empty`, `footer`, `back`, `close`, `item`, `item-leading`, `item-label`, `item-description`, `item-trailing`, `group-label`, `content`
- Events: `update:open`, `update:searchTerm`
- Exposed: `commandPaletteRef`

### DashboardSearchButton
- Props: `icon`, `label`, `color` ("neutral"), `variant` ("outline"/"ghost" when collapsed), `collapsed`, `tooltip`, `kbds` (["meta", "k"]), plus ButtonProps
- Slots: `leading`, `default`, `trailing`
- Events: `click`

### DashboardToolbar
- Props: `ui`
- Slots: `default`, `left`, `right`

### DashboardResizeHandle
- Props: `ui`
- Slots: `default`

---

## Pricing Components

### PricingPlan
- Props: `title`, `description`, `badge` (string|BadgeProps), `billingCycle`, `billingPeriod`, `price`, `discount`, `features` (string[]|PricingPlanFeature[]), `button` (ButtonProps), `tagline`, `terms`, `orientation` ("vertical"|"horizontal"), `variant` ("soft"|"solid"|"outline"|"subtle"), `highlight`, `scale`, `ui`
- Slots: `badge`, `title`, `description`, `price`, `discount`, `billing`, `features`, `button`, `header`, `body`, `footer`, `tagline`, `terms`

### PricingPlans
- Props: `plans` (PricingPlanProps[]), `orientation` ("horizontal"|"vertical"), `compact`, `scale`, `ui`
- Slots: all PricingPlan slots plus `default`

### PricingTable
- Props: `tiers` (T[]), `sections` (PricingTableSection[]), `caption`, `ui`
- Tier object: `{ id, title?, description?, price?, discount?, billingCycle?, billingPeriod?, badge?, button?, highlight? }`
- Slots: `tier-title`, `tier-description`, `tier-badge`, `tier-button`, `tier-billing`, `tier-discount`, `tier-price`, `section-title`, `feature-title`, `feature-value`, `caption`, `tier`

---

## Auth Component

### AuthForm
- Props: `icon`, `title`, `description`, `fields` (AuthFormField[]), `providers` (ButtonProps[]), `separator` (string|SeparatorProps, "or"), `submit` (ButtonProps, { label: "Continue", block: true }), `schema`, `validate`, `validateOn`, `validateOnInputDelay`, `disabled`, `loading`, `loadingAuto`, `ui`
- Slots: `header`, `leading`, `title`, `description`, `providers`, `separator`, `validation`, `submit`, `footer`
- Events: `submit` (FormSubmitEvent)
- Exposed: `formRef`, `state`

---

## Blog Components

### BlogPost
- Props: `title`, `description`, `date` (string|Date), `badge` (string|BadgeProps), `authors` (UserProps[]), `image` (string|ImgHTMLAttributes), `orientation` ("vertical"|"horizontal"), `variant` ("outline"|"soft"|"subtle"|"ghost"|"naked"), `to`, `target`, `onClick`, `ui`
- Slots: `date`, `badge`, `title`, `description`, `authors`, `header`, `body`, `footer`

### BlogPosts
- Props: `posts` (BlogPostProps[]), `orientation` ("horizontal"|"vertical"), `ui`
- Slots: all BlogPost slots plus `default`

---

## Changelog Components

### ChangelogVersion
- Props: `title`, `description`, `date` (string|Date), `badge` (string|BadgeProps), `authors` (UserProps[]), `image` (string|ImgHTMLAttributes), `indicator` (true), `to`, `target`, `onClick`, `ui`
- Slots: `header`, `badge`, `date`, `title`, `description`, `image`, `body`, `footer`, `authors`, `actions`, `indicator`

### ChangelogVersions
- Props: `versions` (T[]), `indicator` (boolean|UseScrollOptions, true), `indicatorMotion` (boolean|SpringOptions, true), `ui`
- Slots: all ChangelogVersion slots plus `default`

---

## AI Chat Components

### ChatMessage
- Props: `id` (required), `role` ("system"|"user"|"assistant", required), `parts` (UIMessagePart[], required), `icon`, `avatar`, `color`, `variant` ("solid"|"outline"|"soft"|"subtle"|"naked", default "naked"), `side` ("left"|"right"), `actions` (ButtonProps[]), `compact`, `content`, `ui`
- Slots: `leading`, `header`, `content`, `body`, `files`, `actions`

### ChatMessages
- Props: `messages` (UIMessage[]), `status` (ChatStatus), `shouldAutoScroll`, `shouldScrollToBottom` (true), `autoScroll` (boolean|ButtonProps, true), `autoScrollIcon`, `user` (default { side: "right", variant: "soft" }), `assistant` (default { side: "left", variant: "naked" }), `compact`, `spacingOffset`, `ui`
- Slots: `leading`, `header`, `content`, `body`, `files`, `actions`, `default`, `indicator`, `viewport`

### ChatPrompt
- Props: `placeholder`, `variant` ("outline"|"soft"|"subtle"|"naked"), `color`, `error`, `autofocus` (true), `autofocusDelay`, `submitOnEnter` (true; when false, Enter inserts newline and Cmd/Ctrl+Enter submits), `disabled`, `icon`, `avatar`, `loading`, `loadingIcon`, `rows` (1), `autoresize` (true), `autoresizeDelay`, `maxrows`, `modelValue` (""), `ui`
- Slots: `header`, `body`, `footer`, `leading`, `default`, `trailing`
- Events: `submit`, `close`, `update:modelValue`
- Exposed: `textareaRef`

### ChatPromptSubmit
- Props: `status` ("ready"), `icon`, `color`, `variant`, `streamingIcon`, `streamingColor` ("neutral"), `streamingVariant` ("subtle"), `submittedIcon`, `submittedColor` ("neutral"), `submittedVariant` ("subtle"), `errorIcon`, `errorColor` ("error"), `errorVariant` ("soft"), plus ButtonProps
- Slots: `leading`, `default`, `trailing`
- Events: `stop`, `reload`

### ChatReasoning
Collapsible display for AI reasoning/thinking content.
- Props: `text`, `streaming` (false), `duration`, `icon`, `chevron` ("leading"|"trailing", default "trailing"), `chevronIcon`, `autoCloseDelay` (500), `shimmer`, `disabled`, `open`, `defaultOpen`, `unmountOnHide` (false), `ui`
- Slots: `default`
- Events: `update:open`

### ChatShimmer
Text shimmer animation (loading/streaming placeholder).
- Props: `text`, `as` ("span"), `duration` (2), `spread` (2), `ui`

### ChatTool
Collapsible display for an AI tool invocation.
- Props: `text`, `suffix`, `icon`, `loading` (false), `loadingIcon`, `streaming` (false), `variant` ("inline"), `chevron` ("trailing"), `chevronIcon`, `shimmer`, `actions` (ButtonProps[], e.g. tool approval buttons), `disabled`, `open`, `defaultOpen`, `unmountOnHide` (false), `ui`
- Slots: `default`, `actions`
- Events: `update:open`

### ChatPalette
- Props: `ui`
- Slots: `default` (for ChatMessages), `prompt` (for ChatPrompt)

---

## Editor Component

### Editor
- Props: `modelValue` (string|JSONContent|JSONContent[]), `contentType` ("json"|"html"|"markdown"), `starterKit` (set false for plain text), `placeholder`, `markdown`, `image` (true), `mention` (true), `handlers`, `extensions`, `autofocus`, `editable`, `textDirection`, `editorProps`, `enableInputRules`, `enablePasteRules`, `ui` — TipTap editor options and event callbacks also pass through (`onCreate`, `onUpdate`, `onFocus`, `onBlur`, `onSelectionUpdate`, …)
- Slots: `default` (for toolbar/menu components)
- Events: `update:modelValue`
- Exposed: `editor` (TipTap Editor instance)
- Companion components: `EditorToolbar`, `EditorDragHandle`, `EditorEmojiMenu`, `EditorMentionMenu`, `EditorSuggestionMenu`

---

## Color Mode Components

### ColorModeButton
- Toggles color mode on click. Extends ButtonProps.
- Props: `color` ("neutral"), `variant` ("ghost"), plus all ButtonProps
- Slots: `fallback`
- Events: `click`

### ColorModeSelect
- Dropdown to select color mode (system/light/dark). Extends SelectMenu props.
- Props: all SelectMenu props, `searchInput` (false)

### ColorModeSwitch
- Switch to toggle light/dark. Extends Switch props.

### ColorModeAvatar
- Avatar with different `light`/`dark` sources. Props: `light` (required), `dark` (required), plus Avatar props.

### ColorModeImage
- Img element with different `light`/`dark` sources. Props: `light` (required), `dark` (required), plus img attributes.

---

## Locale Component

### LocaleSelect
- Language selector. Extends SelectMenu props.
- Props: `modelValue`, `locales`, plus SelectMenu props

---

## Content Components (require @nuxt/content)

### ContentNavigation
Accordion-style navigation tree from Nuxt Content's `navigation`.
- Props: `navigation`, `color`, `variant` ("pill"|"link"), `highlight`, `highlightColor`, `trailingIcon`, `defaultOpen`, `collapsible` (true), `type` ("multiple"), `level` (0), `unmountOnHide` (true), `ui`
- Slots: `link`, `link-leading`, `link-title`, `link-trailing`

### ContentSearch
Ready-made CommandPalette modal for docs search.
- Props: `files`, `navigation`, `links`, `groups`, `shortcut` ("meta_k"), `search` (async FTS5 search fn), `searchStatus`, `searchDelay` (100), `fuse`, `colorMode` (true), plus CommandPalette/Modal props
- Events: `update:searchTerm`

### ContentSearchButton
Pre-styled button to open ContentSearch. Extends ButtonProps; `kbds` (["meta","k"]), `collapsed` (true), `tooltip` (false).

### ContentSurround
Prev/next page links.
- Props: `surround`, `prevIcon`, `nextIcon`, `ui`
- Slots: `link`, `link-leading`, `link-title`, `link-description`

### ContentToc
Sticky table of contents with active-anchor highlighting.
- Props: `links`, `title`, `color`, `highlight`, `highlightColor`, `highlightVariant`, `trailingIcon`, `open`, `defaultOpen`, `ui`
- Slots: `leading`, `default`, `trailing`, `content`, `link`, `top`, `bottom`
- Events: `update:open`, `move`

Prose components (auto-used when rendering markdown with @nuxt/content: headings, links, code blocks, tables, plus `Callout`, `Note`/`Tip`/`Warning`/`Caution`, `Steps`, `CodeGroup`, `CodeCollapse`, `CodeTree`, `CodePreview`, `Card`/`CardGroup`, `Field`/`FieldGroup`, `Prompt`, …) are documented at `https://ui.nuxt.com/raw/docs/typography.md`.

---

## Composables

- `useToast()` — `{ add, update, remove, clear }`; see Toast above.
- `useOverlay()` — programmatic modals/slideovers: `const modal = useOverlay().create(MyModalComponent, { props })`, then `const instance = modal.open(props)`; `await instance.result` resolves with the value the component emits via `emit('close', value)`. Also `modal.patch(props)`, `modal.close()`.
- `defineShortcuts({ meta_k: fn, 'g-d': fn, escape: { usingInput: true, handler } })` — global keyboard shortcuts; `extractShortcuts(items)` pulls shortcuts from menu item arrays.
- `useTour(steps)` — guided tours by re-anchoring a single Popover across steps; each step has `target` (element getter), `title`, `body`, optional `side`; bind the returned `reference` to `<UPopover>`.
- `useScrollShadow()` — scroll-edge shadow state (used by ScrollArea's `shadow`).
- `defineLocale()` / `extendLocale()` — create or extend a locale for the `locale` prop on App.
