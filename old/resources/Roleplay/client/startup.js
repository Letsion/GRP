import * as alt from "alt-client";
import * as native from "natives";
native.pauseClock(true);

//system
import "./system/playerevents.js";
import "./system/interval.js";

//Login
import "./login/panel.js";
import "./login/screen.js";

//char
import "./char/charselect.js";
import "./char/charcreator.js";

//Vehicle
import "./vehicle/speedometer.js";
import "./vehicle/vehicleHandling.js";

//admin
import "./admin/antiCheatHandling.js";
import "./admin/adminCommands.js";
import "./admin/adminMenu.js";

//notification
import "./notification/main";

//chat
import "./chat/client";

//creator
import "./char/creator/editor.js";

//stateFaction
//LSMD
import "./stateFaction/LSMD/main.js";

//money
import "./money/atm.js";

//key
import './settings/settings.js';

//utility
import './utility/mugshot.js';
import './utility/markers.js';

//inventory
import './inventory/inventory.js';

//teleport
import './teleport/main.js';

//ped
import './ped/ped.js';

//audio
import './audio/main.js';

native.animpostfxStopAll();
native.doScreenFadeIn(0);

//IPL Load
alt.on('connectionComplete', () => {
  alt.requestIpl('apa_v_mp_h_08_a');
  alt.requestIpl("sm_smugdlc_interior_placement");
  alt.requestIpl("sm_smugdlc_interior_placement_interior_0_smugdlc_int_01_milo_");
  alt.requestIpl("xm_x17dlc_int_placement");
  alt.requestIpl("xm_x17dlc_int_placement_interior_0_x17dlc_int_base_ent_milo_");
  alt.requestIpl("xm_x17dlc_int_placement_interior_10_x17dlc_int_tun_straight_milo_");
  alt.requestIpl("xm_x17dlc_int_placement_interior_11_x17dlc_int_tun_slope_flat_milo_");
  alt.requestIpl("xm_x17dlc_int_placement_interior_12_x17dlc_int_tun_flat_slope_milo_");
  alt.requestIpl("xm_x17dlc_int_placement_interior_13_x17dlc_int_tun_30d_r_milo_");
  alt.requestIpl("xm_x17dlc_int_placement_interior_14_x17dlc_int_tun_30d_l_milo_");
  alt.requestIpl("xm_x17dlc_int_placement_interior_15_x17dlc_int_tun_straight_milo_");
  alt.requestIpl("xm_x17dlc_int_placement_interior_16_x17dlc_int_tun_straight_milo_");
  alt.requestIpl("xm_x17dlc_int_placement_interior_17_x17dlc_int_tun_slope_flat_milo_");
  alt.requestIpl("xm_x17dlc_int_placement_interior_18_x17dlc_int_tun_slope_flat_milo_");
  alt.requestIpl("xm_x17dlc_int_placement_interior_19_x17dlc_int_tun_flat_slope_milo_");
  alt.requestIpl("xm_x17dlc_int_placement_interior_1_x17dlc_int_base_loop_milo_");
  alt.requestIpl("xm_x17dlc_int_placement_interior_20_x17dlc_int_tun_flat_slope_milo_");
  alt.requestIpl("xm_x17dlc_int_placement_interior_21_x17dlc_int_tun_30d_r_milo_");
  alt.requestIpl("xm_x17dlc_int_placement_interior_22_x17dlc_int_tun_30d_r_milo_");
  alt.requestIpl("xm_x17dlc_int_placement_interior_23_x17dlc_int_tun_30d_r_milo_");
  alt.requestIpl("xm_x17dlc_int_placement_interior_24_x17dlc_int_tun_30d_r_milo_");
  alt.requestIpl("xm_x17dlc_int_placement_interior_25_x17dlc_int_tun_30d_l_milo_");
  alt.requestIpl("xm_x17dlc_int_placement_interior_26_x17dlc_int_tun_30d_l_milo_");
  alt.requestIpl("xm_x17dlc_int_placement_interior_27_x17dlc_int_tun_30d_l_milo_");
  alt.requestIpl("xm_x17dlc_int_placement_interior_28_x17dlc_int_tun_30d_l_milo_");
  alt.requestIpl("xm_x17dlc_int_placement_interior_29_x17dlc_int_tun_30d_l_milo_");
  alt.requestIpl("xm_x17dlc_int_placement_interior_2_x17dlc_int_bse_tun_milo_");
  alt.requestIpl("xm_x17dlc_int_placement_interior_30_v_apart_midspaz_milo_");
  alt.requestIpl("xm_x17dlc_int_placement_interior_31_v_studio_lo_milo_");
  alt.requestIpl("xm_x17dlc_int_placement_interior_32_v_garagem_milo_");
  alt.requestIpl("xm_x17dlc_int_placement_interior_33_x17dlc_int_02_milo_");
  alt.requestIpl("xm_x17dlc_int_placement_interior_34_x17dlc_int_lab_milo_");
  alt.requestIpl("xm_x17dlc_int_placement_interior_35_x17dlc_int_tun_entry_milo_");
  alt.requestIpl("xm_x17dlc_int_placement_interior_3_x17dlc_int_base_milo_");
  alt.requestIpl("xm_x17dlc_int_placement_interior_4_x17dlc_int_facility_milo_");
  alt.requestIpl("xm_x17dlc_int_placement_interior_5_x17dlc_int_facility2_milo_");
  alt.requestIpl("xm_x17dlc_int_placement_interior_6_x17dlc_int_silo_01_milo_");
  alt.requestIpl("xm_x17dlc_int_placement_interior_7_x17dlc_int_silo_02_milo_");
  alt.requestIpl("xm_x17dlc_int_placement_interior_8_x17dlc_int_sub_milo_");
  alt.requestIpl("xm_x17dlc_int_placement_interior_9_x17dlc_int_01_milo_");
  alt.requestIpl("xm_x17dlc_int_placement_strm_0");
  alt.requestIpl("xm_bunkerentrance_door");
  alt.requestIpl("xm_hatch_01_cutscene");
  alt.requestIpl("xm_hatch_02_cutscene");
  alt.requestIpl("xm_hatch_03_cutscene");
  alt.requestIpl("xm_hatch_04_cutscene");
  alt.requestIpl("xm_hatch_06_cutscene");
  alt.requestIpl("xm_hatch_07_cutscene");
  alt.requestIpl("xm_hatch_08_cutscene");
  alt.requestIpl("xm_hatch_09_cutscene");
  alt.requestIpl("xm_hatch_10_cutscene");
  alt.requestIpl("xm_hatch_closed");
  alt.requestIpl("xm_hatches_terrain");
  alt.requestIpl("xm_hatches_terrain_lod");
  alt.requestIpl("xm_mpchristmasadditions");
  alt.requestIpl("xm_siloentranceclosed_x17");
  alt.requestIpl("ex_dt1_02_office_02b");
  alt.requestIpl("chop_props");
  alt.requestIpl("FIBlobby");
  alt.removeIpl("FIBlobbyfake");
  alt.requestIpl("FBI_colPLUG");
  alt.requestIpl("FBI_repair");
  alt.requestIpl("v_tunnel_hole");
  alt.requestIpl("TrevorsMP");
  alt.requestIpl("TrevorsTrailer");
  alt.requestIpl("TrevorsTrailerTidy");
  alt.removeIpl("farm_burnt");
  alt.removeIpl("farm_burnt_lod");
  alt.removeIpl("farm_burnt_props");
  alt.removeIpl("farmint_cap");
  alt.removeIpl("farmint_cap_lod");
  alt.requestIpl("farm");
  alt.requestIpl("farmint");
  alt.requestIpl("farm_lod");
  alt.requestIpl("farm_props");
  alt.requestIpl("des_farmhouse");
  alt.requestIpl("facelobby");
  alt.removeIpl("CS1_02_cf_offmission");
  alt.requestIpl("CS1_02_cf_onmission1");
  alt.requestIpl("CS1_02_cf_onmission2");
  alt.requestIpl("CS1_02_cf_onmission3");
  alt.requestIpl("CS1_02_cf_onmission4");
  alt.requestIpl("v_rockclub");
  alt.requestIpl("v_janitor");
  alt.removeIpl("hei_bi_hw1_13_door");
  alt.requestIpl("bkr_bi_hw1_13_int");
  alt.removeIpl("v_carshowroom");
  alt.removeIpl("shutter_open");
  alt.removeIpl("shutter_closed");
  alt.removeIpl("shr_int");
  alt.requestIpl("csr_afterMission");
  alt.requestIpl("v_carshowroom");
  alt.requestIpl("shr_int");
  alt.requestIpl("shutter_closed");
  alt.requestIpl("smboat");
  alt.requestIpl("smboat_distantlights");
  alt.requestIpl("smboat_lod");
  alt.requestIpl("smboat_lodlights");
  alt.requestIpl("cargoship");
  alt.requestIpl("railing_start");
  alt.removeIpl("sp1_10_fake_interior");
  alt.removeIpl("sp1_10_fake_interior_lod");
  alt.requestIpl("sp1_10_real_interior");
  alt.requestIpl("sp1_10_real_interior_lod");
  alt.removeIpl("id2_14_during_door");
  alt.removeIpl("id2_14_during1");
  alt.removeIpl("id2_14_during2");
  alt.removeIpl("id2_14_on_fire");
  alt.removeIpl("id2_14_post_no_int");
  alt.removeIpl("id2_14_pre_no_int");
  alt.removeIpl("id2_14_during_door");
  alt.requestIpl("id2_14_during1");
  alt.removeIpl("Coroner_Int_off");
  alt.requestIpl("coronertrash");
  alt.requestIpl("Coroner_Int_on");
  alt.removeIpl("bh1_16_refurb");
  alt.removeIpl("jewel2fake");
  alt.removeIpl("bh1_16_doors_shut");
  alt.requestIpl("refit_unload");
  alt.requestIpl("post_hiest_unload");
  alt.requestIpl("Carwash_with_spinners");
  alt.requestIpl("KT_CarWash");
  alt.requestIpl("ferris_finale_Anim");
  alt.removeIpl("ch1_02_closed");
  alt.requestIpl("ch1_02_open");
  alt.requestIpl("AP1_04_TriAf01");
  alt.requestIpl("CS2_06_TriAf02");
  alt.requestIpl("CS4_04_TriAf03");
  alt.removeIpl("scafstartimap");
  alt.requestIpl("scafendimap");
  alt.removeIpl("DT1_05_HC_REMOVE");
  alt.requestIpl("DT1_05_HC_REQ");
  alt.requestIpl("DT1_05_REQUEST");
  alt.requestIpl("dt1_05_hc_remove");
  alt.requestIpl("dt1_05_hc_remove_lod");
  alt.requestIpl("FINBANK");
  alt.removeIpl("DT1_03_Shutter");
  alt.removeIpl("DT1_03_Gr_Closed");
  alt.requestIpl("golfflags");
  alt.requestIpl("airfield");
  alt.requestIpl("v_garages");
  alt.requestIpl("v_foundry");
  alt.requestIpl("bkr_bi_id1_23_door");
  alt.requestIpl("lr_cs6_08_grave_closed");
  alt.requestIpl("hei_sm_16_interior_v_bahama_milo_");
  alt.requestIpl("CS3_07_MPGates");
  alt.requestIpl("cs5_4_trains");
  alt.requestIpl("v_lesters");
  alt.requestIpl("v_trevors");
  alt.requestIpl("v_michael");
  alt.requestIpl("v_comedy");
  alt.requestIpl("v_cinema");
  alt.requestIpl("V_Sweat");
  alt.requestIpl("V_35_Fireman");
  alt.requestIpl("redCarpet");
  alt.requestIpl("triathlon2_VBprops");
  alt.requestIpl("jetstenativeurnel");
  alt.requestIpl("Jetsteal_ipl_grp1");
  alt.requestIpl("v_hospital");
  alt.requestIpl("canyonriver01");
  alt.requestIpl("canyonriver01_lod");
  alt.requestIpl("cs3_05_water_grp1");
  alt.requestIpl("cs3_05_water_grp1_lod");
  alt.requestIpl("trv1_trail_start");
  alt.requestIpl("CanyonRvrShallow");

//pillbox
  alt.removeIpl('rc12b_destroyed');
  alt.removeIpl('rc12b_default');
  alt.removeIpl('rc12b_hospitalinterior_lod');
  alt.removeIpl('rc12b_hospitalinterior');
  alt.removeIpl('rc12b_fixed');

// CASINO
  alt.requestIpl("vw_casino_garage");
  alt.requestIpl("vw_casino_billboard");
  alt.requestIpl("vw_casino_billboard_lod");
  alt.requestIpl("vw_casino_main");
  alt.requestIpl("vw_dlc_casino_door");
  alt.requestIpl("vw_casino_door");
  alt.requestIpl("hei_dlc_casino_door");
  alt.requestIpl("hei_dlc_windows_casino");
  alt.requestIpl("vw_casino_penthouse"); //964 65 112
  alt.requestIpl("hei_dlc_casino_aircon");
  alt.requestIpl("vw_casino_carpark");
});

let proplistCasino = ["Set_Pent_Tint_Shell", "Set_Pent_Pattern_01", "Set_Pent_Spa_Bar_Open", "Set_Pent_Media_Bar_Open", "Set_Pent_Dealer", "Set_Pent_Arcade_Retro", "Set_Pent_Bar_Clutter", "Set_Pent_Clutter_01", "set_pent_bar_light_01", "set_pent_bar_party_0"];
for (let prop of proplistCasino) {
  native.activateInteriorEntitySet(274689, prop);
  native.setInteriorEntitySetColor(274689, prop, 1);
}
native.refreshInterior(274689);

//Doomsday Facility
const interiorID = native.getInteriorAtCoords(483.2, 4810.5, -58.9);
let EnableInteriorProp = native.activateInteriorEntitySet;
let SetInteriorPropColor = native.setInteriorEntitySetColor;
if (native.isValidInterior(interiorID)) {
  EnableInteriorProp(interiorID, "set_int_02_decal_01");
  EnableInteriorProp(interiorID, "set_int_02_lounge1");
  EnableInteriorProp(interiorID, "set_int_02_cannon");
  EnableInteriorProp(interiorID, "set_int_02_clutter1");
  EnableInteriorProp(interiorID, "set_int_02_crewemblem");
  EnableInteriorProp(interiorID, "set_int_02_shell");
  EnableInteriorProp(interiorID, "set_int_02_security");
  EnableInteriorProp(interiorID, "set_int_02_sleep");
  EnableInteriorProp(interiorID, "set_int_02_trophy1");
  EnableInteriorProp(interiorID, "set_int_02_paramedic_complete");
  EnableInteriorProp(interiorID, "set_Int_02_outfit_paramedic");
  EnableInteriorProp(interiorID, "set_Int_02_outfit_serverfarm");
  SetInteriorPropColor(interiorID, "set_int_02_decal_01", 1);
  SetInteriorPropColor(interiorID, "set_int_02_lounge1", 1);
  SetInteriorPropColor(interiorID, "set_int_02_cannon", 1);
  SetInteriorPropColor(interiorID, "set_int_02_clutter1", 1);
  SetInteriorPropColor(interiorID, "set_int_02_shell", 1);
  SetInteriorPropColor(interiorID, "set_int_02_security", 1);
  SetInteriorPropColor(interiorID, "set_int_02_sleep", 1);
  SetInteriorPropColor(interiorID, "set_int_02_trophy1", 1);
  SetInteriorPropColor(interiorID, "set_int_02_paramedic_complete", 1);
  SetInteriorPropColor(interiorID, "set_Int_02_outfit_paramedic", 1);
  SetInteriorPropColor(interiorID, "set_Int_02_outfit_serverfarm", 1);
  native.refreshInterior(interiorID);
}

const iterior = native.getInteriorAtCoords(-1266.0, -3014.0, -47.0);

if (native.isValidInterior(iterior)) {
  EnableInteriorProp(iterior, "set_lighting_hangar_a");
  EnableInteriorProp(iterior, "set_tint_shell");
  EnableInteriorProp(iterior, "set_bedroom_tint");
  EnableInteriorProp(iterior, "set_crane_tint");
  EnableInteriorProp(iterior, "set_modarea");
  EnableInteriorProp(iterior, "set_lighting_tint_props");
  EnableInteriorProp(iterior, "set_floor_1");
  EnableInteriorProp(iterior, "set_floor_decal_1");
  EnableInteriorProp(iterior, "set_bedroom_modern");
  EnableInteriorProp(iterior, "set_office_modern");
  EnableInteriorProp(iterior, "set_bedroom_blinds_open");
  EnableInteriorProp(iterior, "set_lighting_wall_tint01");
  SetInteriorPropColor(iterior, "set_tint_shell", 1);
  SetInteriorPropColor(iterior, "set_bedroom_tint", 1);
  SetInteriorPropColor(iterior, "set_crane_tint", 1);
  SetInteriorPropColor(iterior, "set_modarea", 1);
  SetInteriorPropColor(iterior, "set_lighting_tint_props", 1);
  SetInteriorPropColor(iterior, "set_floor_decal_1", 1);
  native.refreshInterior(iterior);
}

// TEST

let nearIsland = false;

alt.everyTick(() => {
  let distance = alt.Player.local.pos.distanceTo(new alt.Vector3(4840.571, -5174.425, 2.0));
  if (distance < 2000) {
    if (!nearIsland) {
      nearIsland = true;
      native.setIslandHopperEnabled("HeistIsland", true);
      native.setScenarioGroupEnabled("Heist_Island_Peds", true);
      native.setAudioFlag("PlayerOnDLCHeist4Island", true);
      native.setAmbientZoneListStatePersistent("AZL_DLC_Hei4_Island_Zones", true, true);
      native.setAmbientZoneListStatePersistent("AZL_DLC_Hei4_Island_Disabled_Zones", false, true);
    }
  } else {
    if (nearIsland) {
      nearIsland = false;
      native.setIslandHopperEnabled("HeistIsland", false);
      native.setScenarioGroupEnabled("Heist_Island_Peds", false);
      native.setAudioFlag("PlayerOnDLCHeist4Island", false);
      native.setAmbientZoneListStatePersistent("AZL_DLC_Hei4_Island_Zones", false, false);
      native.setAmbientZoneListStatePersistent("AZL_DLC_Hei4_Island_Disabled_Zones", false, false);
    }
  }
  if (nearIsland) {
    native.setRadarAsExteriorThisFrame();
    native.setRadarAsInteriorThisFrame(alt.hash("h4_fake_islandx"), 4700.0, -5145.0, 0, 0);
  }
});

alt.on('connectionComplete', () => {
  //pillbox
  let gabzpillbox= native.getInteriorAtCoords(311.2546, -592.4204, 42.32737);
  native.pinInteriorInMemory(gabzpillbox);
  native.refreshInterior(gabzpillbox);

  //mrpd
  let gabzmrpd = native.getInteriorAtCoords(451.0129, -993.3741, 29.1718);
  native.pinInteriorInMemory(gabzmrpd);
    const data = [
      { name: "branded_style_set" },
      { name: "v_gabz_mrpd_rm1" },
      { name: "v_gabz_mrpd_rm2" },
      { name: "v_gabz_mrpd_rm3" },
      { name: "v_gabz_mrpd_rm4" },
      { name: "v_gabz_mrpd_rm5" },
      { name: "v_gabz_mrpd_rm6" },
      { name: "v_gabz_mrpd_rm7" },
      { name: "v_gabz_mrpd_rm8" },
      { name: "v_gabz_mrpd_rm9" },
      { name: "v_gabz_mrpd_rm10" },
      { name: "v_gabz_mrpd_rm11" },
      { name: "v_gabz_mrpd_rm12" },
      { name: "v_gabz_mrpd_rm13" },
      { name: "v_gabz_mrpd_rm14" },
      { name: "v_gabz_mrpd_rm15" },
      { name: "v_gabz_mrpd_rm16" },
      { name: "v_gabz_mrpd_rm17" },
      { name: "v_gabz_mrpd_rm18" },
      { name: "v_gabz_mrpd_rm19" },
      { name: "v_gabz_mrpd_rm20" },
      { name: "v_gabz_mrpd_rm21" },
      { name: "v_gabz_mrpd_rm22" },
      { name: "v_gabz_mrpd_rm23" },
      { name: "v_gabz_mrpd_rm24" },
      { name: "v_gabz_mrpd_rm25" },
      { name: "v_gabz_mrpd_rm26" },
      { name: "v_gabz_mrpd_rm27" },
      { name: "v_gabz_mrpd_rm28" },
      { name: "v_gabz_mrpd_rm29" },
      { name: "v_gabz_mrpd_rm30" },
      { name: "v_gabz_mrpd_rm31" },
    ];
    activateInterior(gabzmrpd, data);
    native.refreshInterior(gabzmrpd)
});

const activateInterior = (id, interiors) => {
  interiors.forEach((interior) => {
    if (!native.isInteriorEntitySetActive(id, interior.name)) {
      native.activateInteriorEntitySet(id, interior.name);
      if (interior.color) {
        native.setInteriorEntitySetColor(id, interior.name, interior.color);
      }
    }
  })
};



