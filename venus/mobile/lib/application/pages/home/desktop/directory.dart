import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:venus/application/components/empty.dart';
import 'package:venus/application/components/loading.dart';
import 'package:venus/models/album.dart';
import 'package:venus/models/directory.dart';
import 'package:venus/services/directory.dart';

import 'album.dart';
import 'appbody.dart';

final StateProvider<String> _activeItem = StateProvider((_) => "");

class VSDirectoryWidget extends ConsumerWidget {
  final VSAlbumModel currentAlbum;
  const VSDirectoryWidget(this.currentAlbum, {super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Container(
      color: const Color(0xFFF9F9F9),
      width: 200,
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Container(
          height: 40,
          color: const Color(0xFFF2F2F2),
          child: Row(
            children: [
              const SizedBox(
                width: 16,
              ),
              Text(currentAlbum.title),
              GestureDetector(
                child: const Image(
                    image: AssetImage('static/images/console/down-arrow.png')),
                onTap: () {
                  ref.read(activeSelectAlbum.notifier).update((state) => "XXX");
                },
              )
            ],
          ),
        ),
        Expanded(
            child: Container(
          width: double.infinity,
          padding: EdgeInsets.zero,
          child: FutureBuilder(
            future: selectDirectories(currentAlbum.pk),
            builder: (BuildContext context,
                AsyncSnapshot<List<VSDirectoryModel>> snapshot) {
              var directoryModels = snapshot.data;
              if (directoryModels == null) {
                return const VSLoading();
              }
              return Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children:
                    directoryModels.map((album) => _ItemWidget(album)).toList(),
              );
            },
          ),
        ))
      ]),
    );
  }
}

class _ItemWidget extends ConsumerWidget {
  final VSDirectoryModel directoryModel;
  const _ItemWidget(this.directoryModel);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return MouseRegion(
      child: Container(
        padding: const EdgeInsets.only(left: 16, right: 16, top: 8, bottom: 8),
        width: double.infinity,
        color: ref.watch(_activeItem) == directoryModel.pk
            ? const Color(0xFFF2F2F2)
            : Colors.transparent,
        child: Text(directoryModel.title),
      ),
      onEnter: (event) {
        ref.read(_activeItem.notifier).update((state) => directoryModel.pk);
      },
      onExit: (event) {
        ref.read(_activeItem.notifier).update((state) => "");
      },
    );
  }
}
