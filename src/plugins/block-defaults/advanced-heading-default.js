import TypographyControls from '../../typography-control';
import range from 'lodash/range';
import map from 'lodash/map';
/**
 * Internal block libraries
 */
const { __, sprintf } = wp.i18n;
const {
	Component,
	Fragment,
} = wp.element;
const {
	ColorPalette,
	AlignmentToolbar,
} = wp.editor;
const {
	PanelBody,
	Toolbar,
	RangeControl,
	ButtonGroup,
	Button,
	Dashicon,
	Modal,
	SelectControl,
} = wp.components;

import icons from '../../icons';

class KadenceAdvancedHeadingDefault extends Component {
	constructor() {
		super( ...arguments );
		this.saveConfig = this.saveConfig.bind( this );
		this.saveConfigState = this.saveConfigState.bind( this );
		this.state = {
			isOpen: false,
			isSaving: false,
			configuration: ( kadence_blocks_params.configuration ? JSON.parse( kadence_blocks_params.configuration ) : {} ),
		};
	}
	saveConfig( blockID, settingArray ) {
		this.setState( { isSaving: true } );
		const config = this.state.configuration;
		if ( ! config[ blockID ] ) {
			config[ blockID ] = {};
		}
		config[ blockID ] = settingArray;
		const settingModel = new wp.api.models.Settings( { kadence_blocks_config_blocks: JSON.stringify( config ) } );
		settingModel.save().then( response => {
			this.setState( { isSaving: false, configuration: config, isOpen: false } );
			kadence_blocks_params.configuration = JSON.stringify( config );
		} );
	}
	saveConfigState( key, value ) {
		const config = this.state.configuration;
		if ( ! config[ 'kadence/advancedheading' ] ) {
			config[ 'kadence/advancedheading' ] = {};
		}
		config[ 'kadence/advancedheading' ][ key ] = value;
		this.setState( { configuration: config } );
	}
	render() {
		const { configuration, isOpen } = this.state;
		const headingConfig = ( configuration && configuration[ 'kadence/advancedheading' ] ? configuration[ 'kadence/advancedheading' ] : {} );
		const marginTypes = [
			{ key: 'px', name: __( 'px' ) },
			{ key: 'em', name: __( 'em' ) },
			{ key: '%', name: __( '%' ) },
			{ key: 'vh', name: __( 'vh' ) },
		];
		const marginMin = ( ( undefined !== headingConfig.marginType ? headingConfig.marginType : 'px' ) === 'em' ? 0.1 : 1 );
		const marginMax = ( ( undefined !== headingConfig.marginType ? headingConfig.marginType : 'px' ) === 'em' ? 12 : 100 );
		const marginStep = ( ( undefined !== headingConfig.marginType ? headingConfig.marginType : 'px' ) === 'em' ? 0.1 : 1 );
		const createLevelControl = ( targetLevel ) => {
			return [ {
				icon: 'heading',
				// translators: %s: heading level e.g: "1", "2", "3"
				title: sprintf( __( 'Heading %d' ), targetLevel ),
				isActive: targetLevel === ( undefined !== headingConfig.level ? headingConfig.level : 2 ),
				onClick: () => this.saveConfigState( 'level', targetLevel ),
				subscript: String( targetLevel ),
			} ];
		};
		const sizeTypes = [
			{ key: 'px', name: __( 'px' ) },
			{ key: 'em', name: __( 'em' ) },
		];
		return (
			<Fragment>
				<Button className="kt-block-defaults" onClick={ () => this.setState( { isOpen: true } ) }>
					<span className="kt-block-icon">{ icons.headingBlock }</span>
					{ __( 'Advanced Heading' ) }
				</Button>
				{ isOpen ?
					<Modal
						className="kt-block-defaults-modal"
						title={ __( 'Kadence Advanced Heading' ) }
						onRequestClose={ () => {
							this.saveConfig( 'kadence/advancedheading', headingConfig );
						} }>
						<PanelBody
							title={ __( 'Advanced Heading Controls' ) }
							initialOpen={ true }
						>
							<div className="components-base-control">
								<p className="kt-setting-label">{ __( 'HTML Tag' ) }</p>
								<Toolbar controls={ range( 1, 7 ).map( createLevelControl ) } />
							</div>
							<div className="components-base-control">
								<p className="kt-setting-label">{ __( 'Text Alignment' ) }</p>
								<AlignmentToolbar
									value={ ( undefined !== headingConfig.align ? headingConfig.align : '' ) }
									onChange={ ( nextAlign ) => {
										this.saveConfigState( 'align', nextAlign );
									} }
								/>
							</div>
							<div className="components-base-control">
								<p className="kt-setting-label">{ __( 'Heading Color' ) }</p>
								<ColorPalette
									value={ ( undefined !== headingConfig.color ? headingConfig.color : '' ) }
									onChange={ ( value ) => this.saveConfigState( 'color', value ) }
								/>
							</div>
							<div className="components-base-control">
								<p className="kt-setting-label">{ __( 'Heading Font Size Units' ) }</p>
								<ButtonGroup className="kt-size-type-options-defaults" aria-label={ __( 'Size Type' ) }>
									{ map( sizeTypes, ( { name, key } ) => (
										<Button
											key={ key }
											className="kt-size-btn"
											isSmall
											isPrimary={ ( undefined !== headingConfig.sizeType ? headingConfig.sizeType : 'px' ) === key }
											aria-pressed={ ( undefined !== headingConfig.sizeType ? headingConfig.sizeType : 'px' ) === key }
											onClick={ () => this.saveConfigState( 'sizeType', key ) }
										>
											{ name }
										</Button>
									) ) }
								</ButtonGroup>
							</div>
							<div className="components-base-control">
								<p className="kt-setting-label">{ __( 'Heading Line Heights Units' ) }</p>
								<ButtonGroup className="kt-size-type-options-defaults" aria-label={ __( 'Size Type' ) }>
									{ map( sizeTypes, ( { name, key } ) => (
										<Button
											key={ key }
											className="kt-size-btn"
											isSmall
											isPrimary={ ( undefined !== headingConfig.lineType ? headingConfig.lineType : 'px' ) === key }
											aria-pressed={ ( undefined !== headingConfig.lineType ? headingConfig.lineType : 'px' ) === key }
											onClick={ () => this.saveConfigState( 'lineType', key ) }
										>
											{ name }
										</Button>
									) ) }
								</ButtonGroup>
							</div>
						</PanelBody>
						<PanelBody
							title={ __( 'Advanced Typography Settings' ) }
							initialOpen={ false }
						>
							<TypographyControls
								letterSpacing={ ( undefined !== headingConfig.letterSpacing ? headingConfig.letterSpacing : '' ) }
								onLetterSpacing={ ( value ) => this.saveConfigState( 'letterSpacing', value ) }
								fontFamily={ ( undefined !== headingConfig.typography ? headingConfig.typography : '' ) }
								onFontFamily={ ( value ) => this.saveConfigState( 'typography', value ) }
								onFontChange={ ( select ) => {
									this.saveConfigState( 'typography', select.value );
									this.saveConfigState( 'googleFont', select.google );
								} }
								googleFont={ ( undefined !== headingConfig.googleFont ? headingConfig.googleFont : false ) }
								onGoogleFont={ ( value ) => this.saveConfigState( 'googleFont', value ) }
								loadGoogleFont={ ( undefined !== headingConfig.loadGoogleFont ? headingConfig.loadGoogleFont : true ) }
								onLoadGoogleFont={ ( value ) => this.saveConfigState( 'loadGoogleFont', value ) }
								fontVariant={ ( undefined !== headingConfig.fontVariant ? headingConfig.fontVariant : '' ) }
								onFontVariant={ ( value ) => this.saveConfigState( 'fontVariant', value ) }
								fontWeight={ ( undefined !== headingConfig.fontWeight ? headingConfig.fontWeight : 'regular' ) }
								onFontWeight={ ( value ) => this.saveConfigState( 'fontWeight', value ) }
								fontStyle={ ( undefined !== headingConfig.fontStyle ? headingConfig.fontStyle : 'normal' ) }
								onFontStyle={ ( value ) => this.saveConfigState( 'fontStyle', value ) }
								fontSubset={ ( undefined !== headingConfig.fontSubset ? headingConfig.fontSubset : '' ) }
								onFontSubset={ ( value ) => this.saveConfigState( 'fontSubset', value ) }
								textTransform={ ( undefined !== headingConfig.textTransform ? headingConfig.textTransform : '' ) }
								onTextTransform={ ( value ) => this.saveConfigState( 'textTransform', value ) }
							/>
						</PanelBody>
						<PanelBody
							title={ __( 'Highlight Settings' ) }
							initialOpen={ false }
						>
							<div className="components-base-control">
								<p className="kt-setting-label">{ __( 'Highlight Color' ) }</p>
								<ColorPalette
									value={ ( undefined !== headingConfig.markColor ? headingConfig.markColor : '#f76a0c' ) }
									onChange={ value => this.saveConfigState( 'markColor', value ) }
								/>
							</div>
							<div className="components-base-control">
								<p className="kt-setting-label">{ __( 'Highlight Background' ) }</p>
								<ColorPalette
									value={ ( undefined !== headingConfig.markBG ? headingConfig.markBG : '' ) }
									onChange={ value => this.saveConfigState( 'markBG', value ) }
								/>
							</div>
							<RangeControl
								label={ __( 'Highlight Background Opacity' ) }
								value={ ( undefined !== headingConfig.markBGOpacity ? headingConfig.markBGOpacity : 1 ) }
								onChange={ value => this.saveConfigState( 'markBGOpacity', value ) }
								min={ 0 }
								max={ 1 }
								step={ 0.01 }
							/>
							<div className="components-base-control">
								<p className="kt-setting-label">{ __( 'Highlight Border Color' ) }</p>
								<ColorPalette
									value={ ( undefined !== headingConfig.markBorder ? headingConfig.markBorder : '' ) }
									onChange={ value => this.saveConfigState( 'markBorder', value ) }
								/>
							</div>
							<RangeControl
								label={ __( 'Highlight Border Opacity' ) }
								value={ ( undefined !== headingConfig.markBorderOpacity ? headingConfig.markBorderOpacity : 1 ) }
								onChange={ value => this.saveConfigState( 'markBorderOpacity', value ) }
								min={ 0 }
								max={ 1 }
								step={ 0.01 }
							/>
							<SelectControl
								label={ __( 'Highlight Border Style' ) }
								value={ ( undefined !== headingConfig.markBorderStyle ? headingConfig.markBorderStyle : 'solid' ) }
								options={ [
									{ value: 'solid', label: __( 'Solid' ) },
									{ value: 'dashed', label: __( 'Dashed' ) },
									{ value: 'dotted', label: __( 'Dotted' ) },
								] }
								onChange={ value => this.saveConfigState( 'markBorderStyle', value ) }
							/>
							<RangeControl
								label={ __( 'Highlight Border Width' ) }
								value={ ( undefined !== headingConfig.markBorderWidth ? headingConfig.markBorderWidth : 0 ) }
								onChange={ value => this.saveConfigState( 'markBorderWidth', value ) }
								min={ 0 }
								max={ 20 }
								step={ 1 }
							/>
							<div className="components-base-control">
								<p className="kt-setting-label">{ __( 'Mark Font Size Units' ) }</p>
								<ButtonGroup className="kt-size-type-options-defaults" aria-label={ __( 'Size Type' ) }>
									{ map( sizeTypes, ( { name, key } ) => (
										<Button
											key={ key }
											className="kt-size-btn"
											isSmall
											isPrimary={ ( undefined !== headingConfig.markSizeType ? headingConfig.markSizeType : 'px' ) === key }
											aria-pressed={ ( undefined !== headingConfig.markSizeType ? headingConfig.markSizeType : 'px' ) === key }
											onClick={ () => this.saveConfigState( 'markSizeType', key ) }
										>
											{ name }
										</Button>
									) ) }
								</ButtonGroup>
							</div>
							<div className="components-base-control">
								<p className="kt-setting-label">{ __( 'Mark Line Heights Units' ) }</p>
								<ButtonGroup className="kt-size-type-options-defaults" aria-label={ __( 'Size Type' ) }>
									{ map( sizeTypes, ( { name, key } ) => (
										<Button
											key={ key }
											className="kt-size-btn"
											isSmall
											isPrimary={ ( undefined !== headingConfig.markLineType ? headingConfig.markLineType : 'px' ) === key }
											aria-pressed={ ( undefined !== headingConfig.markLineType ? headingConfig.markLineType : 'px' ) === key }
											onClick={ () => this.saveConfigState( 'markLineType', key ) }
										>
											{ name }
										</Button>
									) ) }
								</ButtonGroup>
							</div>
							<TypographyControls
								letterSpacing={ ( undefined !== headingConfig.markLetterSpacing ? headingConfig.markLetterSpacing : '' ) }
								onLetterSpacing={ ( value ) => this.saveConfigState( 'markLetterSpacing', value ) }
								fontFamily={ ( undefined !== headingConfig.markTypography ? headingConfig.markTypography : '' ) }
								onFontFamily={ ( value ) => this.saveConfigState( 'markTypography', value ) }
								onFontChange={ ( select ) => {
									this.saveConfigState( 'markTypography', select.value );
									this.saveConfigState( 'markGoogleFont', select.google );
								} }
								googleFont={ ( undefined !== headingConfig.markGoogleFont ? headingConfig.markGoogleFont : false ) }
								onGoogleFont={ ( value ) => this.saveConfigState( 'markGoogleFont', value ) }
								loadGoogleFont={ ( undefined !== headingConfig.markLoadGoogleFont ? headingConfig.markLoadGoogleFont : true ) }
								onLoadGoogleFont={ ( value ) => this.saveConfigState( 'markLoadGoogleFont', value ) }
								fontVariant={ ( undefined !== headingConfig.markFontVariant ? headingConfig.markFontVariant : '' ) }
								onFontVariant={ ( value ) => this.saveConfigState( 'markFontVariant', value ) }
								fontWeight={ ( undefined !== headingConfig.markFontWeight ? headingConfig.markFontWeight : 'regular' ) }
								onFontWeight={ ( value ) => this.saveConfigState( 'markFontWeight', value ) }
								fontStyle={ ( undefined !== headingConfig.markFontStyle ? headingConfig.markFontStyle : 'normal' ) }
								onFontStyle={ ( value ) => this.saveConfigState( 'markFontStyle', value ) }
								fontSubset={ ( undefined !== headingConfig.markFontSubset ? headingConfig.markFontSubset : '' ) }
								onFontSubset={ ( value ) => this.saveConfigState( 'markFontSubset', value ) }
								padding={ ( undefined !== headingConfig.markPadding ? headingConfig.markPadding : [ 0, 0, 0, 0 ] ) }
								onPadding={ ( value ) => this.saveConfigState( 'markPadding', value ) }
								paddingControl={ ( undefined !== headingConfig.markPaddingControl ? headingConfig.markPaddingControl : 'linked' ) }
								onPaddingControl={ ( value ) => this.saveConfigState( 'markPaddingControl', value ) }
								textTransform={ ( undefined !== headingConfig.markTextTransform ? headingConfig.markTextTransform : '' ) }
								onTextTransform={ ( value ) => this.saveConfigState( 'markTextTransform', value ) }
							/>
						</PanelBody>
						<PanelBody
							title={ __( 'Margin Settings' ) }
							initialOpen={ false }
						>
							<ButtonGroup className="kt-size-type-options" aria-label={ __( 'Margin Type' ) }>
								{ map( marginTypes, ( { name, key } ) => (
									<Button
										key={ key }
										className="kt-size-btn"
										isSmall
										isPrimary={ ( undefined !== headingConfig.marginType ? headingConfig.marginType : 'px' ) === key }
										aria-pressed={ ( undefined !== headingConfig.marginType ? headingConfig.marginType : 'px' ) === key }
										onClick={ () => this.saveConfigState( 'marginType', key ) }
									>
										{ name }
									</Button>
								) ) }
							</ButtonGroup>
							<RangeControl
								label={ __( 'Top Margin' ) }
								value={ ( undefined !== headingConfig.topMargin ? headingConfig.topMargin : '' ) }
								onChange={ ( value ) => this.saveConfigState( 'topMargin', value ) }
								min={ marginMin }
								max={ marginMax }
								step={ marginStep }
							/>
							<ButtonGroup className="kt-size-type-options" aria-label={ __( 'Margin Type' ) }>
								{ map( marginTypes, ( { name, key } ) => (
									<Button
										key={ key }
										className="kt-size-btn"
										isSmall
										isPrimary={ ( undefined !== headingConfig.marginType ? headingConfig.marginType : 'px' ) === key }
										aria-pressed={ ( undefined !== headingConfig.marginType ? headingConfig.marginType : 'px' ) === key }
										onClick={ () => this.saveConfigState( 'marginType', key ) }
									>
										{ name }
									</Button>
								) ) }
							</ButtonGroup>
							<RangeControl
								label={ __( 'Bottom Margin' ) }
								value={ ( undefined !== headingConfig.bottomMargin ? headingConfig.bottomMargin : '' ) }
								onChange={ ( value ) => this.saveConfigState( 'bottomMargin', value ) }
								min={ marginMin }
								max={ marginMax }
								step={ marginStep }
							/>
						</PanelBody>
						<Button className="kt-defaults-save" isDefault isPrimary onClick={ () => {
							this.saveConfig( 'kadence/advancedheading', headingConfig );
						} }>
							{ __( 'Save/Close' ) }
						</Button>
					</Modal>
					: null }
			</Fragment>
		);
	}
}
export default KadenceAdvancedHeadingDefault;
